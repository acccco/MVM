import {mergeOptions} from "../../util/options"

export function initMixin(RD) {
  RD.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
