import {initExtend} from "./extend"
import {initMixin} from "./mixin"
import {initUse} from "./use"

export function initGlobalApi(RD) {

  // 设置 option 为一个对象
  RD.options = {}

  // 保存原始 Vue 类对象
  RD.options._base = RD
  RD.options.components = {}

  // 实现子类生成方法
  initExtend(RD)

  // 实现全局混入
  initMixin(RD)

  // 实现扩展
  initUse(RD)

}