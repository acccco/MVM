import {initExtend} from "./extend"
import {initMixin} from "./mixin"
import {initUse} from "./use";

export function initGlobalApi(Mvm) {

    // 设置 option 为一个对象
    Mvm.options = {}

    // 保存原始 Vue 类对象
    Mvm.options._base = Mvm
    Mvm.options.components = {}

    // 实现子类生成方法
    initExtend(Mvm)

    // 实现全局混入
    initMixin(Mvm)

    // 实现扩展
    initUse(Mvm)

}