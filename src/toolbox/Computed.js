import {Watcher} from './Watcher'
import {noop} from '../util/util'

let uid = 0

/**
 * 实现计算属性的类
 * 内部还是使用 Watcher 来实现
 */
export class Computed {
  constructor(ctx, key, option) {
    this.id = uid++
    this.ctx = ctx
    this.key = key
    this.option = option
    this.active = true
    this.watch = null
    this.value = null
    this.init()
  }

  init() {
    let rd = this.ctx
    let watcher = this.watch = new Watcher(
      rd,
      this.option.get || noop,
      (newValue) => {
        rd[this.key] = newValue
      }
    )
    this.value = watcher.value
  }

  teardown() {
    if (this.active) {
      this.watch.teardown()
    }
  }
}