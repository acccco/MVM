import {always} from 'ramda'

export {mergeAll, merge, clone, is} from 'ramda'

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

export function warn(msg, vm) {
  console.log(msg)
  console.log(vm)
}