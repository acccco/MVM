import always from 'ramda/src/always'
import merge from 'ramda/src/merge'
import clone from 'ramda/src/clone'
import is from 'ramda/src/is'
import isEmpty from 'ramda/src/isEmpty'
import isNil from 'ramda/src/isNil'
import equals from 'ramda/src/equals'

export {merge, clone, is, isEmpty, isNil, equals}

export function proxy(target, sourceKey, key) {
  let sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get() {
    },
    set() {
    }
  }
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

/**
 * 将 proxyObj 下的属性代理到 target 对象下，仅仅是代理，不是赋值
 * @param target
 * @param proxyObj
 * @param cb
 */
export function proxyObject(target, proxyObj, cb = always(true)) {
  let sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get() {
    },
    set() {
    }
  }
  for (let key in proxyObj) {
    let needProxy = cb(key)
    if (needProxy === false) {
      continue
    }
    sharedPropertyDefinition.get = function proxyGetter() {
      return proxyObj[key]
    }
    sharedPropertyDefinition.set = function proxySetter(val) {
      proxyObj[key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
  }
}

export function noop() {

}

/**
 * 从祖先节点上获得最近的 provide
 * @param ctx
 * @param key
 * @param defaultValue
 * @returns {*}
 */
export function getProvideForInject(ctx, key, defaultValue) {
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

export function makeMap(str, expectsLowerCase) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}

export function warn(msg, rd) {
  console.log(msg)
  console.log(rd)
}

/**
 * 检查属性的覆盖情况
 * @param name
 * @param type
 * @param ctx
 * @returns {boolean}
 */
export function checkProp(name, type, ctx) {
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