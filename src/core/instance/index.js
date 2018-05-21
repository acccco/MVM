import {Event} from "../../toolbox/Event"
import {mergeOptions} from "../../util/options"
import {initState} from "./state"
import {initProperties} from "./properties"
import {Watcher} from "../../toolbox/Watcher"
import {callHook} from "./lifecycle";

let uid = 0

export class Mvm extends Event {
    constructor(options) {
        super()
        this.id = uid++
        this._init(options)
        this.active = true
    }

    _init(options) {
        let vm = this
        callHook(vm, 'beforeCreate')

        vm.$options = mergeOptions(
            this.constructor.options,
            options
        )

        initProperties(vm)
        initState(vm)
        callHook(vm, 'created')

    }

    $watch(getter, callback, option) {
        return new Watcher(this, getter, callback, option)
    }

    $destory() {
        if (this.active) {
            let vm = this
            callHook(vm, 'beforeDestroy')

            let parent = vm.$parent
            parent.$children.splice(parent.$children.indexOf(vm), 1)
            vm.$parent = null

            while (vm._watch.length) {
                let watcher = vm._watch.shift()
                watcher.teardown()
            }

            while (vm._computed.length) {
                let computed = vm._computed.shift()
                computed.teardown()
            }

            vm.$off()

            while (vm.$children.length !== 0) {
                let child = vm.$children.pop()
                child.$destory()
            }

            callHook(vm, 'destroyed')
            this.active = false
        }

    }

}