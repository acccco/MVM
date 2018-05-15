import {initExtend} from "./extend"
import {initMixin} from "./mixin"
import {initUse} from "./use";

export function initGlobalApi(MVM) {

    // 设置 option 为一个对象
    MVM.options = {}

    // 保存原始 Vue 类对象
    MVM.options._base = MVM
    MVM.options.components = {}

    // 实现子类生成方法
    initExtend(MVM)

    // 实现全局混入
    initMixin(MVM)

    // 实现扩展
    initUse(MVM)

}