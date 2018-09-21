import {WatcherInterface} from "../types/watcher"
import {commonObject} from "../types/commom"
import {ComputedInterface} from "../types/computed"

import {Watcher} from './Watcher'
import {noop} from '../util/util'

let uid = 0

/**
 * 实现计算属性的类
 * 内部还是使用 Watcher 来实现
 */
export class Computed implements ComputedInterface {

  id: number
  ctx: any
  key: string
  option: commonObject
  active: boolean
  watch: null | WatcherInterface
  value: any

  constructor(
    ctx: any,
    key: string,
    option: commonObject = {}
  ) {
    this.id = uid++
    this.ctx = ctx
    this.key = key
    this.option = option
    this.active = true
    this.watch = null
    this.value = null
    this._init()
  }

  /**
   * 初始化 computed
   */
  _init() {
    let rd = this.ctx
    let watcher = this.watch = new Watcher(
      rd,
      this.option.get || noop,
      (newValue) => {
        rd[this.key] = newValue
      },
      this.option
    )
    this.value = watcher.value
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
