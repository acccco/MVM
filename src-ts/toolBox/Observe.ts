import {DepInterface} from "../types/dep"
import {commonObject, objOrArray} from "../types/commom"
import {ObserverInterface} from "../types/observer"

import {Dep} from './Dep'
import {arrayMethods} from '../util/array'
import {is} from '../util/util'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

let uid = 0

/**
 * 遍历对象，同时生成一个对象对应的 Dep
 */
class Observer implements ObserverInterface {

  id: number
  dep: DepInterface

  constructor(value: objOrArray) {
    this.id = uid++
    this.dep = new Dep(value, 'this')
    // 处理数组
    if (Array.isArray(value)) {
      const augment = ('__proto__' in {})
        ? protoAugment
        : copyAugment
      // 覆盖原数组方法
      augment(value, arrayMethods, arrayKeys)
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
   * @param {commonObject} obj
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
 * 使用 __proto__ 覆盖原数组方法
 * @param {Array<any>} target
 * @param {object} src
 */
function protoAugment(target: Array<any>, src: object) {
  (<any>target).__proto__ = src // eslint-disable-line
}

/**
 * 直接将数组方法定义在当前对象下，以达到覆盖数组方法的目的
 * @param {Array<any>} target
 * @param {commonObject} src
 * @param {Array<string>} keys
 */
function copyAugment(
  target: Array<any>,
  src: commonObject,
  keys: Array<string>
) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    Object.defineProperty(target, key, {
      value: src[key],
      enumerable: false,
      writable: true,
      configurable: true
    })
  }
}

/**
 * 将对象下的某条属性变成可监听结构
 * @param {commonObject} object
 * @param {string} key
 * @param value
 */
export function defineReactive(
  object: commonObject,
  key: string,
  value: any
) {
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
 * @param {objOrArray} value
 * @returns {any}
 */
export function observe(
  value: objOrArray
) {
  if (typeof value !== 'object') {
    return
  }
  let ob
  if (value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (Object.isExtensible(value)) {
    ob = new Observer(value)
  }
  return ob
}
