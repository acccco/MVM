import {commonObject} from "../types/commom"
import {RDInterface} from "../types/rd"

import always from 'ramda/es/always'
import clone from 'ramda/es/clone'
import is from 'ramda/es/is'
import isEmpty from 'ramda/es/isEmpty'
import equals from 'ramda/es/equals'

export {clone, is, isEmpty, equals}

/**
 * 为 target.key 代理到 target.sourceKey.key
 * @param {Object} target
 * @param {string} sourceKey
 * @param {string} key
 */
export function proxy(target: Object, sourceKey: string, key: string) {
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get() {
      return this[sourceKey][key]
    },
    set(val: string) {
      this[sourceKey][key] = val
    }
  })
}

/**
 * 将 proxyObj 下的属性代理到 target 对象下，仅仅是代理，不是赋值
 * 用 cb 来检测是否符合代理规则
 * @param {Object} target
 * @param {Object} proxyObj
 * @param {(key: string) => boolean} cb 用于判断需不需要代理某条属性
 */
export function proxyObject(target: commonObject, proxyObj: commonObject, cb: ((key: string) => boolean) = always(true)) {
  for (let key in proxyObj) {
    let needProxy = cb(key)
    if (needProxy === false) {
      continue
    }
    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
      get() {
        return proxyObj[key]
      },
      set(val: string) {
        proxyObj[key] = val
      }
    })
  }
}

export function noop() {
  return {}
}

/**
 * 从祖先节点上获得最近的 provide
 * @param {RDInterface} ctx
 * @param {string} key
 * @param defaultValue
 * @returns {any}
 */
export function getProvideForInject(ctx: RDInterface, key: string, defaultValue: any): any {
  let parent = ctx.$parent
  let value = defaultValue
  while (parent) {
    if (parent._provide && key in parent._provide) {
      value = parent._provide[key]
      break
    }
    parent = parent.$parent
  }
  return value
}

/**
 * 一些全局的方法
 */
export const allowedGlobals = makeMap(
  'Infinity,undefined,NaN,isFinite,isNaN,' +
  'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
  'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
  'eval,codeWillRun,$index,' +
  'require' // for Webpack/Browserify
)

/**
 * 将规定字符串设置成一个 map
 * @param {string} str
 * @param {boolean} expectsLowerCase
 * @returns {((val: string) => any) | ((val: string) => any)}
 */
export function makeMap(str: string, expectsLowerCase: boolean = false) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? (val: string) => map[val.toLowerCase()]
    : (val: string) => map[val]
}

export function warn(msg: string, rd: any) {
  console.log(msg)
  console.log(rd)
}

/**
 * 检查属性的覆盖情况
 * @param {string} name
 * @param {string} type
 * @param ctx
 * @returns {boolean}
 */
export function checkProp(name: string, type: string, ctx: any) {
  let usedType
  if (ctx._inject && name in ctx._inject) usedType = 'inject'
  if (ctx._prop && type !== 'prop' && name in ctx._prop) usedType = 'prop'
  if (ctx.$option.method && type !== 'method' && name in ctx.$option.method) usedType = 'method'
  if (ctx._data && type !== 'data' && name in ctx._data) usedType = 'data'
  if (usedType) {
    warn(`${usedType} 下已有 ${name} 属性`, ctx)
    return false
  }
  return true
}
