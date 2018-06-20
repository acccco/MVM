import {Event} from '../../toolbox/Event'
import {mergeOption} from '../../util/option'
import {initState} from './state'
import {initProperties} from './properties'
import {initEvent} from './event'
import {Watcher} from '../../toolbox/Watcher'
import {callHook} from './lifecycle'
import {warn, allowedGlobals, isEmpty, equals} from '../../util/util'
import {pushTarget, popTarget} from "../../toolbox/Dep";

let uid = 0

export class RD extends Event {
  constructor(options) {
    super()
    this.id = uid++
    this._init(options)
    this.active = true
  }

  _init(option) {
    let rd = this

    // 合并 option 参数
    rd.$option = mergeOption(
      this.constructor.option,
      option
    )
    initProperties(rd)

    // 触发 beforeCreate 事件
    callHook(rd, 'beforeCreate')
    initState(rd)

    // 触发 created 事件
    callHook(rd, 'created')
    initEvent(rd)

    // 使用代理拦截属性的获取，得到错误信息
    rd._proxy = window.Proxy ? new Proxy(rd, {
      has(target, key) {
        return (key in target) || !allowedGlobals(key)
      },
      get(target, key) {
        if (typeof key === 'string' && !(key in target)) {
          warn(`data/prop/method/computed 下未定义 ${key}`, target)
        }
        return target[key]
      }
    }) : rd

  }

  // 处理传入的 prop ，当传入的组件的 prop 有更新时
  // 需要调用该方法触发子组件状态更新
  $initProp(prop) {
    if (isEmpty(prop)) return
    // TODO 有效性验证
    let rd = this
    for (let key in rd.$option.prop) {
      let value = prop[key]
      if (!value) {
        value = rd.$option.prop[key].default
      }
      if (!equals(rd[key], value))
        rd[key] = value
    }
  }

  // 用于取消特定的属性监听
  // 比如表单元素的 value 值，发生变化时是不需要引发视图变化的
  $cancelWatch(getter) {
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

  // 创建一个观察者，观察者会观察在 getter 中对属性的 get 的操作
  // 当对应属性发生 set 动作时，会触发 callback
  // 新生成的观察者对象会保存在实例的 _watch 属性下
  $watch(getter, callback, option) {
    let watch = new Watcher(this, getter, callback, option)
    this._watch.push(watch)
    return watch
  }

  // 销毁当前实例
  $destroy() {
    if (this.active) {
      let rd = this
      callHook(rd, 'beforeDestroy')

      // 移除父子关系
      let parent = rd.$parent
      parent.$children.splice(parent.$children.indexOf(rd), 1)
      rd.$parent = null

      // 注销 watch
      while (rd._watch.length) {
        rd._watch.shift().teardown()
      }

      // 注销 computed
      while (rd._computed.length) {
        rd._computed.shift().teardown()
      }

      // 清空事件
      rd.$off()

      // 清空子组件
      while (rd.$children.length !== 0) {
        let child = rd.$children.pop()
        child.$destroy()
      }

      callHook(rd, 'destroyed')
      this.active = false
    }

  }

}