import {optionType} from "../../types/option"
import {classRD} from "../../types/rd"

import {mergeOption} from '../../util/option'

export function initMixin(
  RD: classRD
) {
  RD.mixin = function (
    mixin: optionType
  ) {
    this.option = mergeOption(this.option, mixin)
    return this
  }
}
