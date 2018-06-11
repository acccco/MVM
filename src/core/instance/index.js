import {Event} from '../../toolbox/Event'
import {mergeOptions} from '../../util/options'
import {initState} from './state'
import {initProperties} from './properties'
import {Watcher} from '../../toolbox/Watcher'
import {callHook} from './lifecycle'
import {warn, allowedGlobals} from '../../util/util'

let uid = 0

export class RD extends Event {
  constructor(options) {
    super()
    this.id = uid++
    this._init(options)
    this.active = true
  }

  _init(options) {
    let rd = this

    rd.$options = mergeOptions(
      this.constructor.options,
      options
    )
    initProperties(rd)
    callHook(rd, 'beforeCreate')

    initState(rd)
    callHook(rd, 'created')

    rd._proxy = new Proxy(rd, {
      has(target, key) {
        return (key in target) || !allowedGlobals(key)
      },
      get(target, key) {
        if (typeof key === 'string' && !(key in target)) {
          warn(`data/prop/method 下未定义 ${key}`, target)
        }
        return target[key]
      }
    })

  }

  // 处理传入的 prop
  initProp(prop) {
    // TODO 有效性验证
    let rd = this
    for (let key in rd.$options.prop) {
      let value = prop[key]
      if (!value) {
        value = rd.$options.prop[key].default
      }
      rd[key] = value
    }
  }

  $watch(getter, callback, option) {
    return new Watcher(this, getter, callback, option)
  }

  $destory() {
    if (this.active) {
      let rd = this
      callHook(rd, 'beforeDestroy')

      let parent = rd.$parent
      parent.$children.splice(parent.$children.indexOf(rd), 1)
      rd.$parent = null

      while (rd._watcher.length) {
        let watcher = rd._watcher.shift()
        watcher.teardown()
      }

      while (rd._computed.length) {
        let computed = rd._computed.shift()
        computed.teardown()
      }

      rd.$off()

      while (rd.$children.length !== 0) {
        let child = rd.$children.pop()
        child.$destory()
      }

      callHook(rd, 'destroyed')
      this.active = false
    }

  }

}