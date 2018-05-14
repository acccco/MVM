import R from 'ramda'
import {noop} from "./util"

export function mergeOptions(parent, child) {

    normalizeProps(child)

    normalizeInject(child)

    // 统一先取 child 中的数据，放到新对象中
    let options = R.mergeAll([{}, parent, child])

    if (child.mixins) {
        for (let i = 0, l = child.mixins.length; i < l; i++) {
            options = mergeOptions(options, child.mixins[i])
        }
    }

    normalizeComponent(child, options._base)

    // 合并 data
    options.data = mergeData(parent.data, child.data)

    // 合并 watcher 同名合并成一个数组
    options.watch = mergeWatch(parent.watch, child.watch)

    // 合并 methods 同名覆盖
    options.methods = R.merge(parent.methods, child.methods)

    // 合并 computed 同名覆盖
    options.computed = R.merge(parent.computed, child.computed)

    return options
}

function mergeData(parentValue = noop, childValue = noop) {
    return function mergeFnc() {
        return R.merge(parentValue.call(this), childValue.call(this))
    }
}

function mergeWatch(parentVal = {}, childVal = {}) {
    let watchers = R.clone(parentVal)
    for (let key in childVal) {
        let parent = watchers[key]
        let child = normalizeWatcher(childVal[key])
        if (!parent) {
            parent = []
        }
        watchers[key] = parent.push(child)
    }
    return watchers
}

function normalizeWatcher(watcher) {
    if (R.is(Function, watcher)) {
        return {
            handler: watcher
        }
    }
    return watcher
}

/**
 * 处理 props 返回统一结构
 * @param options
 * return [{
 *     type: xxx
 *     ...
 * }]
 */

function normalizeProps(options) {
    let props = options.props
    let normalProps = options.props = {}
    if (R.is(Array, props)) {
        props.forEach(prop => {
            normalProps[prop] = {
                type: null
            }
        })
    } else {
        for (let key in props) {
            normalProps[key] = R.merge({type: null}, props[key])
        }
    }
}

/**
 * 处理 inject 返回统一结构
 * @param options
 * return [{
 *     from: xxx
 *     ...
 * }]
 */

function normalizeInject(options) {
    let inject = options.inject
    if (R.is(Array, inject)) {
        let normalInject = options.inject = {}
        inject.forEach(key => {
            normalInject[key] = {
                from: key
            }
        })
    }
}

/**
 * 处理 components 返回构造函数
 * @param options
 * @param MVM
 */
function normalizeComponent(options, MVM) {
    let components = options.components
    for (let key in components) {
        if (R.is(Object, components[key])) {
            components[key] = MVM.extend(components[key])
        }
    }
}