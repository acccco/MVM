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

export function warn(msg, vm) {
    console.log(msg)
    console.log(vm)
}