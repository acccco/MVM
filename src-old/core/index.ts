import {commonObject} from "../type/commom"
import {optionType} from "../type/option"
import {RDInterface} from "../type/rd"
import {watcherCallback, watcherOption, WatcherInterface} from "../type/watcher"

import {Event} from '../class/Event'
import {Watcher} from '../class/Watcher'
import {mergeOption} from '../util/option'
import {initState} from './instance/state'
import {initProperties} from './instance/properties'
import {initEvent} from './instance/event'
import {callHook} from './instance/lifecycle'
import {warn, allowedGlobals, isEmpty, equals} from '../util/util'
import {pushTarget, popTarget} from '../class/Dep'

let uid = 0

export class RD extends Event implements RDInterface {
  static version: string
  static option: optionType

  id: number
  active: boolean
  $option: optionType
  $parent: RDInterface | null
  $root: RDInterface
  $children: Array<RDInterface>
  _inject: commonObject
  _provide: commonObject
  _prop: commonObject
  _data: commonObject
  _computed: commonObject
  _watch: Array<WatcherInterface>
  _proxy: WindowProxy | RDInterface

  [propName: string]: any

  constructor(option: optionType) {
    super()
    this.id = uid++
    this.active = true
    // 合并参数
    this.$option = mergeOption(
      (<any>this.constructor).option,
      option
    )
    this.$parent = null
    this.$root = this
    this.$children = []
    this._inject = {}
    this._provide = {}
    this._prop = {}
    this._data = {}
    this._computed = {}
    this._watch = []

    // 使用代理拦截属性的获取，得到错误信息
    this._proxy = Proxy ? new Proxy(this, {
      has(target, key) {
        return (key in target) || !allowedGlobals(<string>key)
      },
      get(target, key): any {
        if (typeof key === 'string' && !(key in target)) {
          warn(`data/prop/method/computed 下未定义 ${key} 请检查。`, target)
        }
        // @ts-ignore
        return target[key]
      }
    }) : this

    this._init(option)
  }

  /**
   * 初始化 RD 实例
   * @param     {optionType} option
   * @returns   {void}
   * @private
   */
  _init(option: optionType): void {
    initProperties(this)

    // 触发 beforeCreate 事件
    callHook(this, 'beforeCreate')
    initState(this)

    // 触发 created 事件
    callHook(this, 'created')
    initEvent(this)
  }

  /**
   * 处理传入的 prop ，当传入的组件的 prop 有更新时，需要调用该方法触发子组件状态更新
   * @param {object} prop
   */
  $initProp(prop: commonObject) {
    if (isEmpty(prop)) return
    // TODO 有效性验证

    for (let key in this.$option.prop) {
      let value = prop[key]
      if (!value) {
        value = this.$option.prop[key].default
      }
      if (!equals(this[key], value)) {
        this[key] = value
      }
    }
  }

  /**
   * 取消对对象下某个属性的监听
   * 比如表单元素的 value 值，发生变化时是不需要引发视图变化的
   * @param {(string | (() => any))} getter
   * @returns {any}
   */
  $cancelWatch(getter: string | (() => any)): any {
    pushTarget(null)
    let value = null
    if (typeof getter === 'string') {
      value = getter.split('.').reduce((res, name) => res[name], this)
    } else if (typeof getter === 'function') {
      value = getter.call(this)
    }
    popTarget()
    return value
  }

  /**
   * 创建一个观察者，观察者会观察在 getter 中对属性的 get 的操作
   * 当对应属性发生 set 动作并且值发生变化时时，会触发 callback
   * 新生成的观察者对象会保存在实例的 _watch 属性下
   * @param   {(string | (() => any))}  getter
   * @param   {watcherCallback}         callback
   * @param   {watcherOption}           option
   * @returns {Watcher}
   */
  $watch(getter: string | Function, callback: watcherCallback, option: watcherOption): Watcher {
    if (typeof getter === 'string') {
      getter = () => {
        (<string>getter).split('.').reduce((res, name) => res[name], this)
      }
    }
    let watch = new Watcher(this, getter, callback, option)
    this._watch.push(watch)
    return watch
  }

  /**
   * 销毁当前实例
   */
  $destroy() {
    if (this.active) {
      callHook(this, 'beforeDestroy')

      // 移除父子关系
      let parent = this.$parent
      if (parent) parent.$children.splice(parent.$children.indexOf(this), 1)
      this.$parent = null

      // 注销 watch
      while (this._watch.length) {
        // @ts-ignore
        this._watch.shift().destroy()
      }

      // 清空事件
      this.$off()

      // 清空子组件
      while (this.$children.length) {
        // @ts-ignore
        this.$children.pop().$destroy()
      }

      callHook(this, 'destroyed')
      this.active = false
    }
  }
}
