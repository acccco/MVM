import {mergeOptions} from "../../util/options"

export function initExtend(RD) {
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

        return Sub
    }
}