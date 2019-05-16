import {arrayT} from "../types/commom"
import {eventGroup, EventInterface} from "../types/event"

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
  _event: eventGroup

  constructor() {
    this.id = uid++
    this._event = {}
  }

  /**
   * 添加事件处理函数
   * @param {arrayT<string>} eventName
   * @param {arrayT<Function>} fn
   * @returns {this}
   */
  $on(eventName: arrayT<string>, fn: arrayT<Function>) {
    if (Array.isArray(eventName)) {
      eventName.forEach(name => this.$on(name, fn))
    } else {
      if (!Array.isArray(fn)) {
        fn = [fn]
      }
      (this._event[eventName] || (this._event[eventName] = [])).push(...<[]>fn)
    }
    return this
  }

  /**
   * 添加仅触发一次的函数
   * @param {string} eventName
   * @param {Function} fn
   * @returns {this}
   */
  $once(eventName: string, fn: Function) {
    let proxyFun: Function = (...args: Array<any>) => {
      this.$off(eventName, proxyFun)
      fn.apply(this, args)
    }

    // @ts-ignore
    proxyFun.fn = fn

    this.$on(eventName, proxyFun)
    return this
  }

  /**
   * 按照规则清除，事件对应的函数
   * @param {arrayT<string>} eventName
   * @param {arrayT<Function>} fn
   * @returns {this}
   */
  $off(eventName?: arrayT<string> | undefined, fn?: arrayT<Function>) {
    // 清空所有事件
    if (!arguments.length) {
      this._event = {}
      return this
    }
    // 清空多个事件
    if (Array.isArray(eventName)) {
      eventName.forEach(name => this.$off(name, fn))
      return this
    }
    eventName = <string>eventName
    // 若没有事件对应的函数列表则不用处理
    const cbs = this._event[eventName]
    if (!cbs) {
      return this
    }
    // 清空特定事件
    if (!fn) {
      this._event[eventName] = null
      return this
    }
    // 取消特定事件的特定处理函数
    if (fn) {
      let cb
      let i = cbs.length
      // 处理一次取消多个的情况
      if (Array.isArray(fn)) {
        fn.forEach(fnc => this.$off(eventName, fnc))
        return this
      }
      while (i--) {
        cb = cbs[i]
        // @ts-ignore
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1)
          break
        }
      }
    }
    return this
  }

  /**
   * 触发事件对应的函数
   * @param {string} eventName
   * @param args
   * @returns {this}
   */
  $emit(eventName: string, ...args: Array<any>) {
    let cbs = this._event[eventName]
    if (cbs) {
      cbs.forEach(func => func.apply(this, args))
    }
    return this
  }
}
