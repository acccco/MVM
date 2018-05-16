import {Computed} from "../../toolbox/Computed"
import {Watcher} from "../../toolbox/Watcher"
import {getProvideForInject, proxyObject, is, warn} from "../../util/util"
import {observe} from "../../toolbox/Observe"

export function initState(vm) {
    let opts = vm.$options

    vm._inject = {}
    vm._prop = {}
    vm._data = {}
    vm._provide = {}
    
    if (opts.inject) initInject(vm)
    if (opts.prop) initProp(vm)
    if (opts.method) initMethod(vm)
    if (opts.data) initData(vm)
    if (opts.computed) initComputed(vm)
    if (opts.watch) initWatch(vm)
    if (opts.provide) initProvide(vm)
}

function initInject(vm) {
    let inject = vm._inject
    for (let key in  vm.$options.inject) {
        inject[key] = getProvideForInject(vm, key, vm.$options.inject[key].default)
    }
    proxyObject(vm, inject)
}

function initProp(vm) {
    let prop = vm._prop
    let propData = vm.$options.propData
    for (let key in vm.$options.prop) {
        let value = propData[key]
        if (!value) {
            value = vm.$options.props[key].default
        }
        prop[key] = value
    }
    observe(prop)
    proxyObject(vm, prop, (key) => {
        let usedType
        if (key in vm._inject) usedType = 'inject'
        warn(`${usedType} 下已有 ${key} 属性`, vm)
    })
}

function initMethod(vm) {
    for (let key in vm.$options.method) {
        let usedType
        console.log(vm._inject, vm._prop)
        if (key in vm._inject) usedType = 'inject'
        if (key in vm._prop) usedType = 'prop'
        if (usedType) {
            warn(`${usedType} 下已有 ${key} 属性`, vm)
            break
        }
        vm[key] = vm.$options.method[key].bind(vm)
    }
}

function initData(vm) {
    // TODO 必须是函数判断，返回值必须是对象判断
    let data = vm._data = vm.$options.data ? vm.$options.data.call(vm) : {}
    observe(data)
    proxyObject(vm, data, (key) => {
        let usedType
        if (key in vm._inject) usedType = 'inject'
        if (key in vm._prop) usedType = 'prop'
        if (key in vm.$options.method) usedType = 'method'
        if (usedType)
            warn(`${usedType} 下已有 ${key} 属性`, vm)
    })
}

function initComputed(vm) {
    for (let key in vm.$options.computed) {

        let usedType
        if (key in vm._inject) usedType = 'inject'
        if (key in vm._prop) usedType = 'prop'
        if (key in vm.$options.method) usedType = 'method'
        if (key in vm._data) usedType = 'data'
        if (usedType) {
            warn(`${usedType} 下已有 ${key} 属性`, vm)
            break
        }

        new Computed(vm, key, vm.$options.computed[key])
    }
}

function initWatch(vm) {
    for (let key in vm.$options.watch) {
        vm.$options.watch[key].forEach(option => {
            new Watcher(vm, () => {
                return key.split('.').reduce((obj, name) => obj[name], vm)
            }, option.handler, option)
        })
    }
}

function initProvide(vm) {
    vm._provide = is(Function, vm.$options.provide) ? vm.$options.provide.call(vm) : vm.$options.provide
}