import {WatcherInterface} from "../types/watcher"
import {ComputedInterface, computedHandle} from "../types/computed"

import {Watcher} from './Watcher'
import {noop} from '../util/util'

let uid = 0

/**
 * 实现计算属性的类
 * 内部还是使用 Watcher 来实现
 */
export class Computed implements ComputedInterface {

  id: number
  active: boolean
  watch: WatcherInterface
  value: any

  constructor(ctx: any, key: string, handle: computedHandle) {
    this.id = uid++
    this.active = true
    this.value = null

    this.watch = new Watcher(
      ctx,
      handle.get || noop,
      (newValue: any) => {
        ctx[key] = newValue
      },
      {}
    )
    this.value = this.watch.value
  }

  /**
   * 销毁当前 computed 实例
   */
  destroy() {
    if (this.active) {
      this.watch.destroy()
    }
  }
}
