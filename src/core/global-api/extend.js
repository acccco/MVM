import {mergeOptions} from "../../util/options"

let cid = 0

export function initExtend(RD) {
  RD.cid = cid++
  RD.extend = function (extendOptions) {
    const Super = this

    class Sub extends Super {
      constructor(options) {
        super(options)
      }
    }

    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )

    Sub.super = Super
    Sub.extend = Super.extend
    Sub.cid = cid++

    return Sub
  }
}