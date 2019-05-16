import {optionType} from "../../types/option"

import {mergeOption} from '../../util/option'

let cid = 1

export function initExtend(RD: any) {
  RD.extend = function (extendOption: optionType) {
    const Super = this

    class Sub extends Super {
    }

    Sub.super = Super
    Sub.cid = cid++

    Sub.option = mergeOption(Super.option, extendOption)

    Sub.extend = Super.extend
    Sub.mixin = Super.mixin

    return Sub
  }
}
