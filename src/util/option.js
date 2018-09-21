import { noop, merge, clone, is } from './util'
import { LIFECYCLE_HOOK } from '../core/instance/lifecycle'

/**
 * 判断是否是定义的属性
 * @param key
 * @returns {boolean}
 */
function isUserPrams(key) {
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
  option.computed = mergeComputed(option.computed, child.computed)

  // 合并 computed 同名覆盖
  option.computed = merge(option.computed, child.computed)

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
 * @param parentValue
 * @param childValue
 * @returns {function(): *}
 */
function mergeData(parentValue = noop, childValue = noop) {
  return function mergeFnc() {
    return merge(parentValue.call(this), childValue.call(this))
  }
}

/**
 * 合并 watch 属性
 * @param parentVal
 * @param childVal
 * @returns {*}
 */
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

/**
 * 合并 computed 属性
 * @param parentVal
 * @param childVal
 * @returns {*}
 */
function mergeComputed(parentVal = {}, childVal = {}) {
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
 * @param watcher
 * @returns {*}
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
 * 统一处理不同形式的 computed
 * @param computed
 * @returns {*}
 */
function normalizeComputed(computed) {
  if (is(Function, computed)) {
    return {
      get: computed,
      set: noop
    }
  }
  return computed
}

/**
 * 统一处理生命周期函数
 * @param option
 * @param name
 */
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
 * 统一处理不同形式的 prop
 * @param option
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
      normalProps[key] = merge({ type: null }, prop[key])
    }
  }
}

/**
 * 统一处理不同形式的 inject
 * @param option
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
  } else if (is(Object, inject)) {
    for (let key in inject) {
      if (!('from' in inject[key])) {
        inject[key].from = key
      }
      normalInject[key] = Object.assign({}, inject[key])
    }
  }
}
