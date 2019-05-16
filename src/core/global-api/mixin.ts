import {optionType} from "../../types/option"

import {mergeOption} from '../../util/option'

export function initMixin(RD: any) {
  RD.mixin = function (mixin: optionType) {
    this.option = mergeOption(this.option, mixin)
    return this
  }
}
