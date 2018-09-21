import {commonObject} from "../types/commom"
import {RDInterface} from "../types/rd"

import always from 'ramda/src/always'
import merge from 'ramda/src/merge'
import clone from 'ramda/src/clone'
import is from 'ramda/src/is'
import isEmpty from 'ramda/src/isEmpty'
import isNil from 'ramda/src/isNil'
import equals from 'ramda/src/equals'

export {merge, clone, is, isEmpty, isNil, equals}

/**
 * 为 target.key 代理到 target.sourceKey.key
 * @param {commonObject} target
 * @param {string} sourceKey
 * @param {string} key
 */
export function proxy(target: commonObject, sourceKey: string, key: string) {
  let sharedPropertyDefinition: commonObject = {
    enumerable: true,
    configurable: true
  }
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter(val: string) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

/**
 * 将 proxyObj 下的属性代理到 target 对象下，仅仅是代理，不是赋值
 * 用 cb 来检测是否符合代理规则
 * @param {commonObject} target
 * @param {commonObject} proxyObj
 * @param {(key: string) => boolean} cb
 */
export function proxyObject(
  target: commonObject,
  proxyObj: commonObject,
  cb: ((key: string) => boolean) = always(true)
) {
  let sharedPropertyDefinition: commonObject = {
    enumerable: true,
    configurable: true
  }
  for (let key in proxyObj) {
    let needProxy = cb(key)
    if (needProxy === false) {
      continue
    }
    sharedPropertyDefinition.get = function proxyGetter() {
      return proxyObj[key]
    }
    sharedPropertyDefinition.set = function proxySetter(val: string) {
      proxyObj[key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
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
export function getProvideForInject(ctx: RDInterface, key: string, defaultValue: any) {
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
