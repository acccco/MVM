import {Event} from "../../toolbox/Event"
import {observe} from "../../toolbox/Observe"
import {Watcher} from "../../toolbox/Watcher"
import {Computed} from "../../toolbox/Computed"
import {mergeOptions} from "../../util/options"
import {proxy, getProvideForInject} from "../../util/util"

let uid = 0

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

        let parent = vm.$options.parent
        if (parent) {
            parent.$children.push(vm)
        }
        vm.$parent = parent
        vm.$root = parent ? parent.$root : vm
        vm.$children = []

        for (let key in vm.$options.method) {
            vm[key] = vm.$options.method[key].bind(vm)
        }

        let data = vm._data = vm.$options.data ? vm.$options.data.call(vm) : {}
        observe(data)
        for (let key in data) {
            proxy(vm, '_data', key)
        }

        let props = vm._props = {}
        let propsData = vm.$options.propsData
        for (let key in vm.$options.props) {
            let value = propsData[key]
            if (!value) {
                value = vm.$options.props[key].default
            }
            props[key] = value
        }
        observe(props)
        for (let key in props) {
            proxy(vm, '_props', key)
        }

        vm._provide = vm.$options.provide

        let inject = vm._inject = {}
        for (let key in  vm.$options.inject) {
            inject[key] = getProvideForInject(vm, key, vm.$options.inject[key].default)
        }
        for (let key in inject) {
            proxy(vm, '_inject', key)
        }

        for (let key in vm.$options.watch) {
            vm.$options.watch[key].forEach(option => {
                new Watcher(vm, () => {
                    return key.split('.').reduce((obj, name) => obj[name], vm)
                }, option.handler, option)
            })
        }

        for (let key in vm.$options.computed) {
            new Computed(vm, key, vm.$options.computed[key])
        }

    }
}