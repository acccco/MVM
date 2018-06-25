import {noop, merge, clone, is} from './util'
import {LIFECYCLE_HOOK} from '../core/instance/lifecycle'

function needMerge(key) {
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
 * @param parent
 * @param child
 * @returns {*}
 */
export function mergeOption(parent = {}, child = {}) {

  normalizeComputed(parent)
  normalizeComputed(child)

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

  // 合并 method 同名覆盖
  option.method = merge(option.method, child.method)

  // 合并 computed 同名覆盖
  option.computed = merge(option.computed, child.computed)

  // 其他属性合并
  for (let key in child) {
    if (needMerge(key)) {
      option[key] = child[key]
    }
  }

  return option
}

function mergeData(parentValue = noop, childValue = noop) {
  return function mergeFnc() {
    return merge(parentValue.call(this), childValue.call(this))
  }
}

function mergeWatch(parentVal = {}, childVal = {}) {
  let watchers = clone(parentVal)
  for (let key in watchers) {
    if (!is(Array, watchers[key])) {
      watchers[key] = [normalizeWatcher(watchers[key])]
    }
  }
  for (let key in childVal) {
    let parent = watchers[key]
    let child = normalizeWatcher(childVal[key])
    if (!parent) {
      parent = watchers[key] = []
    }
    parent.push(child)
  }
  return watchers
}

function normalizeLifecycle(option, name) {
  if (undefined === option[name]) {
    option[name] = []
    return
  }
  if (!is(Array, option[name])) {
    option[name] = [option[name]]
  }
}

/**
 *
 * @param watcher
 * return {
 *   handler: Function,
 *   ...
 * }
 */
function normalizeWatcher(watcher) {
  if (is(Function, watcher)) {
    return {
      handler: watcher
    }
  }
  return watcher
}

/**
 * 处理 prop 返回统一结构
 * @param option
 * return {
 *   key: {
 *     type: String|Number|...,
 *     ...
 *   }
 * }
 */

function normalizeProp(option) {
  if (!option.prop) {
    return
  }
  let prop = option.prop
  let normalProps = option.prop = {}
  if (is(Array, prop)) {
    prop.forEach(prop => {
      normalProps[prop] = {
        type: null
      }
    })
  } else {
    for (let key in prop) {
      normalProps[key] = merge({type: null}, prop[key])
    }
  }
}

/**
 * 处理 inject 返回统一结构
 * @param option
 * returns {
 *   key: {
 *     from: xxx,
 *     ...
 *   }
 * }
 */

function normalizeInject(option) {
  let inject = option.inject
  let normalInject = option.inject = {}
  if (is(Array, inject)) {
    inject.forEach(key => {
      normalInject[key] = {
        from: key
      }
    })
  }
  if (is(Object, inject)) {
    for (let key in inject) {
      if (!('from' in inject[key])) {
        inject[key].from = key
      }
    }
  }
}

/**
 * 处理 computed 返回统一结构
 * @param option
 * return {
 *   key: {
 *     get: Function,
 *     set: Function
 *   }
 * }
 */
function normalizeComputed(option) {
  let computed = option.computed
  for (let key in computed) {
    if (is(Function, computed[key])) {
      option.computed[key] = {
        get: computed[key],
        set: noop
      }
    }
  }
}