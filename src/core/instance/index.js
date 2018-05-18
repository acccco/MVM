import {Event} from "../../toolbox/Event"
import {mergeOptions} from "../../util/options"
import {initState} from "./state";
import {initProperties} from "./properties"
import {Watcher} from "../../toolbox/Watcher";

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

        initProperties(vm)
        initState(vm)

    }

    $watch(getter, callback, option) {
        return new Watcher(this, getter, callback, option)
    }

}