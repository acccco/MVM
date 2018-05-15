import {mergeOptions} from "../../util/options"

export function initMixin(Mvm) {
    Mvm.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin)
        return this
    }
}
