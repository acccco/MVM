import {mergeOptions} from "../../util/options"

export function initMixin(MVM) {
    MVM.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin)
        return this
    }
}
