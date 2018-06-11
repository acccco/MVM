import {mergeOption} from '../../util/option'

let cid = 0

export function initExtend(RD) {
  RD.cid = cid++
  RD.extend = function (extendOption) {
    const Super = this

    class Sub extends Super {
      constructor(option) {
        super(option)
      }
    }

    Sub.option = mergeOption(
      Super.option,
      extendOption
    )

    Sub.super = Super
    Sub.extend = Super.extend
    Sub.cid = cid++

    return Sub
  }
}