import {Dep} from './Dep'
import {traverse} from '../util/traverse'
import {watcherQueue} from '../util/watcherQueue'

let uid = 0

export class Watcher {

  constructor(ctx, getter, callback, options) {
    this.id = uid++
    this.active = true

    if (options) {
      this.lazy = !!options.lazy
      this.deep = !!options.deep
      // 为 true 即为: 不需要判断 getter 的返回值是否变化，当有绑定属性变化时，直接执行 callback
      this.ignoreChange = !!options.ignoreChange
    } else {
      this.lazy = this.deep = false
    }

    this.getter = getter.bind(ctx)
    this.cb = callback.bind(ctx)
    this.deps = []
    this.value = this.init()
    this.dirty = false
  }

  init() {
    let oldTarget = Dep.target
    Dep.target = this
    let value = this.getter()
    if (this.deep) {
      // 对其子项添加依赖
      traverse(value)
    }
    Dep.target = oldTarget
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
      let value
      // 深度监听对象,触发了就要执行，不需要判断值有没有变化
      if (!this.ignoreChange || this.deep) {
        value = this.getter()
      }
      if (value !== this.value || this.ignoreChange || this.deep) {
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