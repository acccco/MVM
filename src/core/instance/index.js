import {Event} from "../../toolbox/Event"
import {observe} from "../../toolbox/Observe"
import {Watcher} from "../../toolbox/Watcher"
import {Computed} from "../../toolbox/Computed"
import {mergeOptions} from "../../util/options"
import {proxy, getProvideForInject, proxyObject} from "../../util/util"

let uid = 0

function initTree(vm) {
    let parent = vm.$options.parent
    if (parent) {
        parent.$children.push(vm)
    }
    vm.$parent = parent
    vm.$root = parent ? parent.$root : vm
    vm.$children = []
}

function initState(vm) {
    let opts = vm.$options
    if (opts.inject) initInject(vm)
    if (opts.prop) initProp(vm)
    if (opts.method) initMethod(vm)
    if (opts.data) initData(vm)
    if (opts.computed) initComputed(vm)
    if (opts.watch) initWatch(vm)
    if (opts.provide) vm._provide = vm.$options.provide
}

// TODO 同字段代理判断
function initInject(vm) {
    let inject = vm._inject = {}
    for (let key in  vm.$options.inject) {
        inject[key] = getProvideForInject(vm, key, vm.$options.inject[key].default)
    }
    proxyObject(vm, inject)
}

function initProp(vm) {
    let prop = vm._props = {}
    let propData = vm.$options.propData
    for (let key in vm.$options.prop) {
        let value = propData[key]
        if (!value) {
            value = vm.$options.props[key].default
        }
        prop[key] = value
    }
    observe(prop)
    proxyObject(vm, prop)
}

function initMethod(vm) {
    for (let key in vm.$options.method) {
        vm[key] = vm.$options.method[key].bind(vm)
    }
}

function initData(vm) {
    // TODO 必须是函数判断，返回值必须是对象判断
    let data = vm._data = vm.$options.data ? vm.$options.data.call(vm) : {}
    observe(data)
    proxyObject(vm, data)
}

function initComputed(vm) {
    for (let key in vm.$options.computed) {
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

export class Mvm extends Event {
    constructor(options) {
        super()
        this.id = uid++
        this._init(options)
    }

    _init(options) {
        let vm = this

        vm.$options = mergeOptions(
            this.constructor.options,
            options
        )

        initTree(vm)
        initState(vm)

    }
}