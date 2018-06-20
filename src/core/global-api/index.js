import {initExtend} from './extend'
import {initMixin} from './mixin'
import {initUse} from './use'

export function initGlobalApi(RD) {

  // 初始化 options 用于合并参数
  RD.option = {}

  // 保存原始 RD 类对象
  RD.option._base = RD

  // 子类生成方法
  initExtend(RD)

  // 全局混入
  initMixin(RD)

  // 扩展
  initUse(RD)

}