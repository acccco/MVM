import {initExtend} from './extend'
import {initMixin} from './mixin'
import {initUse} from './use'
import {LIFECYCLE_HOOK} from "../instance/lifecycle"

export function initGlobalApi(RD: any) {
  // 初始化 options 用于合并参数
  RD.cid = 0

  RD.option = {
    // 保存原始 RD 类对象
    _base: RD,
  }

  LIFECYCLE_HOOK.forEach(name => {
    RD.option[name] = []
  })

  // 子类生成方法
  initExtend(RD)

  // 全局混入
  initMixin(RD)

  // 扩展
  initUse(RD)
}
