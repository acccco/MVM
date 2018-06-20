import {Dep} from './Dep'
import {arrayMethods} from '../util/array'
import {is} from '../util/util'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

let uid = 0

/**
 * 遍历对象，同时生成一个对象对应的 Dep
 */
class Observer {

  constructor(value) {
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

  // 遍历对象下属性，使得属性变成可监听的结构
  walk(obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }

  // 同上，遍历数组
  observeArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }

}

// 使用 __proto__ 覆盖原数组方法
function protoAugment(target, src) {
  target.__proto__ = src
}

// 直接将数组方法定义在当前对象下，以达到覆盖数组方法的目的
function copyAugment(target, src, keys) {
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
 * @param object
 * @param key
 * @param value
 * @returns {*}
 */
export function defineReactive(object, key, value) {
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
 * @param value
 * @returns {*}
 */
export function observe(value) {
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