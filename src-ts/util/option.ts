import {
  afterMergeOptionType,
  computedFun,
  computedObj,
  injectArray, injectObj,
  optionComputedType,
  optionType,
  optionWatch,
  optionWatchType,
  propArray,
  propObj, watchFun, watchObj
} from "../types/option"

import {noop, merge, clone, is} from './util'
import {LIFECYCLE_HOOK} from '../core/instance/lifecycle'

/**
 * 判断是否是用户自己写的属性
 * @param {string} key
 * @returns {boolean}
 */
function isUserPrams(
  key: string
): boolean {
  let list = [
    ...LIFECYCLE_HOOK,
    'mixin',
    'data',
    'watch',
    'method',
    'computed'
  ]
  return list.indexOf(key) === -1
}

/**
 * 合并两个 option
 * @param {optionType} parent
 * @param {optionType} child
 * @returns {afterMergeOptionType}
 */
export function mergeOption(
  parent: optionType = {},
  child: optionType = {}
): afterMergeOptionType {
  normalizeProp(child)
  normalizeInject(child)

  let option = merge({}, parent)

  LIFECYCLE_HOOK.forEach(name => {
    normalizeLifecycle(child, name)
    normalizeLifecycle(option, name)
    option[name] = [].concat(option[name]).concat(child[name])
  })

  if (child.mixin) {
    for (let i = 0, l = child.mixin.length; i < l; i++) {
      option = mergeOption(option, child.mixin[i])
    }
  }

  // 合并 data
  option.data = mergeData(option.data, child.data)

  // 合并 watcher 同名合并成一个数组
  option.watch = mergeWatch(option.watch, child.watch)

  // 合并 computed 同名覆盖
  option.computed = mergeComputed(option.computed, child.computed)

  // 合并 method 同名覆盖
  option.method = merge(option.method, child.method)

  // 其他属性合并
  for (let key in child) {
    if (isUserPrams(key)) {
      option[key] = child[key]
    }
  }

  return option
}

/**
 * 合并 data 属性
 * @param {() => object} parentValue
 * @param {() => object} childValue
 * @returns {() => object}
 */
function mergeData(
  parentValue: () => object = noop,
  childValue: () => object = noop
): (() => object) {
  return function mergeFnc() {
    return merge(parentValue.call(this), childValue.call(this))
  }
}

type unMergeWatchType = { [propName: string]: optionWatchType }
type mergeWatchType = { [propName: string]: watchObj }

/**
 * 合并 watch 属性
 * @param {unMergeWatchType} parentVal
 * @param {unMergeWatchType} childVal
 * @returns {mergeWatchType}
 */
function mergeWatch(
  parentVal: unMergeWatchType = {},
  childVal: unMergeWatchType = {}
): mergeWatchType {
  let watcher = clone(parentVal)
  for (let key in watcher) {
    if (!is(Array, watcher[key])) {
      watcher[key] = [normalizeWatcher(watcher[key])]
    }
  }
  for (let key in childVal) {
    let parent = watcher[key]
    let child = normalizeWatcher(<optionWatch>childVal[key])
    if (!parent) {
      parent = watcher[key] = []
    }
    parent.push(child)
  }
  return watcher
}

type unMergeComputedType = { [propName: string]: optionComputedType }
type mergeComputedType = { [propName: string]: computedObj }

/**
 * 合并 computed 属性
 * @param {unMergeComputedType} parentVal
 * @param {unMergeComputedType} childVal
 * @returns {mergeComputedType}
 */
function mergeComputed(
  parentVal: unMergeComputedType = {},
  childVal: unMergeComputedType = {}
): mergeComputedType {
  let computed = clone(parentVal)
  for (let key in computed) {
    computed[key] = normalizeComputed(computed[key])
  }
  for (let key in childVal) {
    computed[key] = normalizeComputed(childVal[key])
  }
  return computed
}

/**
 * 统一处理不同形式的 watcher
 * @param {optionWatch} watcher
 * @returns {watchObj}
 */
function normalizeWatcher(
  watcher: optionWatch
): watchObj {
  if (is(Function, watcher)) {
    return {
      handler: <watchFun>watcher
    }
  }
  return <watchObj>watcher
}

/**
 * 统一处理不同形式的 computed
 * @param {optionComputedType} computed
 * @returns {computedObj}
 */
function normalizeComputed(
  computed: optionComputedType
): computedObj {
  if (is(Function, computed)) {
    return {
      get: <computedFun>computed,
      set: noop
    }
  }
  return <computedObj>computed
}

/**
 * 统一处理生命周期函数
 * @param {optionType} option
 * @param {string} name
 */
function normalizeLifecycle(
  option: optionType,
  name: string
) {
  if (undefined === option[name]) {
    option[name] = []
    return
  }
  if (!is(Array, option[name])) {
    option[name] = [option[name]]
  }
}

/**
 * 统一处理不同形式的 prop
 * @param {optionType} option
 */
function normalizeProp(
  option: optionType
) {
  if (!option.prop) {
    return
  }
  let prop = option.prop
  let normalProps: propObj = option.prop = {}
  if (is(Array, prop)) {
    (<propArray>prop).forEach((prop: string) => {
      normalProps[prop] = {
        type: null
      }
    })
  } else if (is(Object, prop)) {
    let propTs = <propObj>prop
    for (let key in propTs) {
      normalProps[key] = merge({type: null}, propTs[key])
    }
  }
}

/**
 * 统一处理不同形式的 inject
 * @param {optionType} option
 */
function normalizeInject(
  option: optionType
) {
  let inject = option.inject
  let normalInject: injectObj = option.inject = {}
  if (is(Array, inject)) {
    (<injectArray>inject).forEach((key: string) => {
      normalInject[key] = {
        from: key
      }
    })
  } else if (is(Object, inject)) {
    let injectTs = <injectObj>inject
    for (let key in injectTs) {
      if (!('from' in injectTs[key])) {
        injectTs[key].from = key
      }
      normalInject[key] = Object.assign({}, injectTs[key])
    }
  }
}
