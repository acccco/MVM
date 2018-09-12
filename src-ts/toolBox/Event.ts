import {commomObj} from "../types/commom.d.js"
import {eventFunType, EventInterface} from "../types/event"

let uid = 0

/**
 * 事件对象
 * $on:    添加对应事件名的处理函数
 * $once:  仅仅触发一次的事件
 * $off:   花式取消事件
 * $emit:  触发事件
 */
export class Event implements EventInterface {
  id: number
  _events: commomObj

  constructor() {
    this.id = uid++
    this._events = {}
  }

  $on(eventName, fn) {
    if (Array.isArray(eventName)) {
      eventName.forEach(name => this.$on(name, fn))
    } else {
      if (!Array.isArray(fn)) {
        fn = [fn]
      }
      (this._events[eventName] || (this._events[eventName] = [])).push(...fn)
    }
    return this
  }

  $once(eventName, fn) {
    let proxyFun: eventFunType = (...args: Array<any>) => {
      this.$off(eventName, proxyFun);
      fn.apply(this, args);
    };
    proxyFun.fn = fn;

    this.$on(eventName, proxyFun);
    return this
  }

  $off(eventName, fn) {
    // 清空所有事件
    if (!arguments.length) {
      this._events = {}
      return this
    }
    // 清空多个事件
    if (Array.isArray(eventName)) {
      eventName.forEach(name => this.$off(name, fn))
      return this
    }
    // 若没有事件对应的函数列表则不用处理
    const cbs = this._events[eventName]
    if (!cbs) {
      return this
    }
    // 清空特定事件
    if (!fn) {
      this._events[eventName] = null
      return this
    }
    // 取消特定事件的特定处理函数
    if (fn) {
      let cb
      let i = cbs.length
      // 处理一次取消多个的情况
      if (Array.isArray(fn)) {
        fn.forEach(fnc => this.$off(eventName, fnc))
        return
      }
      while (i--) {
        cb = cbs[i]
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1)
          break
        }
      }
    }
    return this
  }

  $emit(eventName, ...args) {
    let cbs = this._events[eventName]
    if (cbs) {
      cbs.forEach(func => func.apply(this, args))
    }
    return this
  }
}
