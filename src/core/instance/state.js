import {Computed} from "../../toolbox/Computed"
import {Watcher} from "../../toolbox/Watcher"
import {getProvideForInject, proxyObject, is, warn} from "../../util/util"
import {observe} from "../../toolbox/Observe"

export function initState(rd) {
    let opts = rd.$options

    rd._inject = {}
    rd._prop = {}
    rd._data = {}
    rd._provide = {}

    if (opts.inject) initInject(rd)
    if (opts.prop) initProp(rd)
    if (opts.method) initMethod(rd)
    if (opts.data) initData(rd)
    if (opts.computed) initComputed(rd)
    if (opts.watch) initWatch(rd)
    if (opts.provide) initProvide(rd)
}

function initInject(rd) {
    let inject = rd._inject
    for (let key in  rd.$options.inject) {
        inject[key] = getProvideForInject(rd, key, rd.$options.inject[key].default)
    }
    proxyObject(rd, inject)
}

function initProp(rd) {
    let prop = rd._prop
    let propData = rd.$options.propData
    for (let key in rd.$options.prop) {
        let value = propData[key]
        if (!value) {
            value = rd.$options.props[key].default
        }
        prop[key] = value
    }
    observe(prop)
    proxyObject(rd, prop, (key) => {
        let usedType
        if (key in rd._inject) usedType = 'inject'
        warn(`${usedType} 下已有 ${key} 属性`, rd)
    })
}

function initMethod(rd) {
    for (let key in rd.$options.method) {
        let usedType
        console.log(rd._inject, rd._prop)
        if (key in rd._inject) usedType = 'inject'
        if (key in rd._prop) usedType = 'prop'
        if (usedType) {
            warn(`${usedType} 下已有 ${key} 属性`, rd)
            break
        }
        rd[key] = rd.$options.method[key].bind(rd)
    }
}

function initData(rd) {
    // TODO 必须是函数判断，返回值必须是对象判断
    let data = rd._data = rd.$options.data ? rd.$options.data.call(rd) : {}
    observe(data)
    proxyObject(rd, data, (key) => {
        let usedType
        if (key in rd._inject) usedType = 'inject'
        if (key in rd._prop) usedType = 'prop'
        if (key in rd.$options.method) usedType = 'method'
        if (usedType)
            warn(`${usedType} 下已有 ${key} 属性`, rd)
    })
}

function initComputed(rd) {
    for (let key in rd.$options.computed) {

        let usedType
        if (key in rd._inject) usedType = 'inject'
        if (key in rd._prop) usedType = 'prop'
        if (key in rd.$options.method) usedType = 'method'
        if (key in rd._data) usedType = 'data'
        if (usedType) {
            warn(`${usedType} 下已有 ${key} 属性`, rd)
            break
        }
        rd._computed.push(new Computed(rd, key, rd.$options.computed[key]))
    }
}

function initWatch(rd) {
    for (let key in rd.$options.watch) {
        rd.$options.watch[key].forEach(option => {
            rd._watch.push(new Watcher(rd, () => {
                return key.split('.').reduce((obj, name) => obj[name], rd)
            }, option.handler, option))
        })
    }
}

function initProvide(rd) {
    rd._provide = is(Function, rd.$options.provide) ? rd.$options.provide.call(rd) : rd.$options.provide
}