import {noop, mergeAll, merge, clone, is} from './util'
import {LIFECYCLE_HOOKS} from '../core/instance/lifecycle'

export function mergeOptions(parent = {}, child = {}) {

  normalizeComputed(parent)

  normalizeProps(child)

  normalizeInject(child)

  normalizeComputed(child)

  // 统一先取 child 中的数据，放到新对象中
  let options = mergeAll([{}, parent, child])

  LIFECYCLE_HOOKS.forEach(name => {
    normalizeLifecycle(child, name)
  })

  if (child.mixins) {
    for (let i = 0, l = child.mixins.length; i < l; i++) {
      options = mergeOptions(options, child.mixins[i])
    }
  }

  // 合并 data
  options.data = mergeData(parent.data, child.data)

  // 合并 watcher 同名合并成一个数组
  options.watch = mergeWatch(parent.watch, child.watch)

  // 合并 methods 同名覆盖
  options.method = merge(parent.method, child.method)

  // 合并 computed 同名覆盖
  options.computed = merge(parent.computed, child.computed)

  return options
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

function normalizeLifecycle(child, name) {
  if (undefined === child[name]) {
    child[name] = []
    return
  }
  if (!is(Array, child[name])) {
    child[name] = [child[name]]
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
 * 处理 props 返回统一结构
 * @param options
 * return {
 *   key: {
 *     type: String|Number|...,
 *     ...
 *   }
 * }
 */

function normalizeProps(options) {
  let props = options.props
  let normalProps = options.props = {}
  if (is(Array, props)) {
    props.forEach(prop => {
      normalProps[prop] = {
        type: null
      }
    })
  } else {
    for (let key in props) {
      normalProps[key] = merge({type: null}, props[key])
    }
  }
}

/**
 * 处理 inject 返回统一结构
 * @param options
 * returns {
 *   key: {
 *     from: xxx,
 *     ...
 *   }
 * }
 */

function normalizeInject(options) {
  let inject = options.inject
  if (is(Array, inject)) {
    let normalInject = options.inject = {}
    inject.forEach(key => {
      normalInject[key] = {
        from: key
      }
    })
  }
}

/**
 * 处理 computed 返回统一结构
 * @param options
 * return {
 *   key: {
 *     get: Function,
 *     set: Function
 *   }
 * }
 */
function normalizeComputed(options) {
  let computed = options.computed
  for (let key in computed) {
    if (is(Function, computed[key])) {
      options.computed[key] = {
        get: computed[key],
        set: noop
      }
    }
  }
}