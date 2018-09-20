import {optionType} from "../../types/option"
import {classRD} from "../../types/rd"

import {mergeOption} from '../../util/option'

let cid = 1

export function initExtend(
  RD: classRD
) {
  RD.extend = function (
    extendOption: optionType
  ) {
    const Super = this

    class Sub extends Super {
    }

    Sub.super = Super
    Sub.cid = cid++

    Sub.option = mergeOption(
      Super.option,
      extendOption
    )

    Sub.extend = Super.extend
    Sub.mixin = Super.mixin

    return Sub
  }
}
