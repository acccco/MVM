import {mergeOption} from '../../util/option'

export function initMixin(RD) {
  RD.mixin = function (mixin) {
    this.option = mergeOption(this.option, mixin)
    return this
  }
}
