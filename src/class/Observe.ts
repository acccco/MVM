import {DepInterface} from "../type/dep"
import {ObserverInterface} from "../type/observer"

import {Dep} from './Dep'
import {arrayMethods} from '../util/array'
import {is} from '../util/util'
import {commonObject} from "../type/commom"
import {computedOption} from "../type/option"

let uid = 0

/**
 * 遍历对象，同时生成一个对象对应的 Dep
 */
class Observer implements ObserverInterface {

  id: number
  dep: DepInterface

  constructor(value: Object | Array<any>) {
    this.id = uid++
    this.dep = new Dep(value, 'this')
    // 处理数组
    if (Array.isArray(value)) {
      // CHECK 设置原型，达到覆盖数组方法的目的
      Object.setPrototypeOf(value, arrayMethods)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
    Object.defineProperty(value, '__ob__', {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true
    })
  }

  /**
   * 遍历对象下属性，使得属性变成可监听的结构
   * @param {Object} obj
   */
  walk(obj: commonObject) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }

  /**
   * 同上，遍历数组
   * @param {Array<any>} items
   */
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

/**
 * 将对象下的某条属性变成可监听结构
 * @param {Object}  object
 * @param {string}  key
 * @param {any}     value
 */
export function defineReactive(object: Object, key: string, value: any) {
  let dep = new Dep(object, key)
  let childOb = observe(value)
  Object.defineProperty(object, key, {
    configurable: true,
    enumerable: true,
    get() {
      if (Dep.target) {
        dep.addSub(Dep.target)
        Dep.target.addDep(dep)
        if (Array.isArray(value)) {
          childOb.dep.addSub(Dep.target)
          Dep.target.addDep(childOb.dep)
        }
      }
      return value
    },
    set(newValue) {
      value = newValue
      if (is(Object, newValue)) {
        observe(newValue)
      }
      dep.notify()
    }
  })
}

/**
 * 属性遍历器
 * @param {any} value
 * @returns {any}
 */
export function observe(value: any) {
  if (typeof value !== 'object') {
    return
  }
  if (value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer) {
    return value.__ob__
  } else if (Object.isExtensible(value)) {
    return new Observer(value)
  }
}

export function observeComputed(computed: computedOption) {
  for (let key in computed) {
    let dep = new Dep(computed, key)
    let value = computed[key]
    Object.defineProperty(computed, key, {
      configurable: true,
      enumerable: true,
      get() {
        if (Dep.target) {
          Dep.target.addDep(dep)
        }
        return value.get()
      },
      set(newValue) {
        value.set(newValue)
      }
    })
  }
}
