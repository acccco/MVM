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
    console.log('rd init')

    rd.$option = mergeOption(
      this.constructor.option,
      option
    )
    initProperties(rd)
    callHook(rd, 'beforeCreate')

    initState(rd)
    callHook(rd, 'created')
    initEvent(rd)

    rd._proxy = new Proxy(rd, {
      has(target, key) {
        return (key in target) || !allowedGlobals(key)
      },
      get(target, key) {
        if (typeof key === 'string' && !(key in target)) {
          warn(`data/prop/method/computed 下未定义 ${key}`, target)
        }
        return target[key]
      }
    })

  }

  // 处理传入的 prop
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

  $watch(getter, callback, option) {
    let watch = new Watcher(this, getter, callback, option)
    this._watch.push(watch)
    return watch
  }

  $destroy() {
    if (this.active) {
      let rd = this
      callHook(rd, 'beforeDestroy')

      let parent = rd.$parent
      parent.$children.splice(parent.$children.indexOf(rd), 1)
      rd.$parent = null

      while (rd._watch.length) {
        let watcher = rd._watch.shift()
        watcher.teardown()
      }

      while (rd._computed.length) {
        let computed = rd._computed.shift()
        computed.teardown()
      }

      rd.$off()

      while (rd.$children.length !== 0) {
        let child = rd.$children.pop()
        child.$destroy()
      }

      callHook(rd, 'destroyed')
      this.active = false
    }

  }

}