import {Dep} from './Dep'
import {traverse} from "../util/traverse"
import {watcherQueue} from "../util/watcherQueue"

let uid = 0

export class Watcher {

  constructor(ctx, getter, callback, options) {
    this.id = ++uid
    this.active = true

    if (options) {
      this.lazy = !!options.lazy
      this.deep = !!options.deep
      // 判断 value 是否需要变化才执行 update
      this.ignoreChange = !!options.ignoreChange
    } else {
      this.lazy = this.deep = false
    }

    this.getter = getter.bind(ctx)
    this.cb = callback.bind(ctx)
    this.deps = []
    this.value = this.init()
    this.dirty = this.lazy
  }

  init() {
    Dep.target = this
    let value = this.getter()
    if (this.deep) {
      // 对其子项添加依赖
      traverse(value)
    }
    Dep.target = null
    return value
  }

  update() {
    if (this.lazy) {
      this.dirty = true
    } else {
      watcherQueue(this)
    }
  }

  run() {
    if (this.active) {
      const value = this.getter()
      if (
        this.ignoreChange ||
        value !== this.value ||
        // 深度监听对象,触发了就要执行，不需要判断值有没有变化
        this.deep
      ) {
        // 设置新值
        const oldValue = this.value
        this.value = value
        this.cb(value, oldValue)
      }
    }
  }

  /**
   * 脏检查机制手动触发更新函数
   */
  evaluate() {
    this.value = this.getter()
    this.dirty = false
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  teardown() {
    if (this.active) {
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.deps = []
      this.active = false
    }
  }

}