import {DepInterface} from "../types/dep"
import {WatcherInterface, watcherOption} from "../types/watcher"

import {Dep, pushTarget, popTarget} from './Dep'
import {traverse} from '../util/traverse'
import {watcherQueue} from '../util/watcherQueue'

let uid: number = 0

export class Watcher implements WatcherInterface {

  id: number
  active: boolean
  lazy: boolean
  dirty: boolean
  deep: boolean
  ignoreChange: boolean
  getter: () => any
  cb: (newValue: any, oldValue: any) => any
  dep: Array<DepInterface>
  depId: Set<number>
  newDep: Array<DepInterface>
  newDepId: Set<number>
  value: any

  constructor(
    ctx: any,
    getter: () => any,
    callback: (newValue: any, oldValue: any) => any,
    options: watcherOption = {}
  ) {
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
    this.dep = []
    this.depId = new Set()
    this.newDep = []
    this.newDepId = new Set()
    this.value = this.get()
    this.dirty = false
  }

  get() {
    pushTarget(this)
    let value = this.getter()
    if (this.deep) {
      // 对其子项添加依赖
      traverse(value)
    }
    popTarget()
    this.cleanupDep()
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
      Dep.target = this
      let value = this.get()
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

  addDep(dep: DepInterface) {
    const id: number = dep.id
    if (!this.newDepId.has(id)) {
      this.newDep.push(dep)
      this.newDepId.add(id)
      if (!this.depId.has(id)) {
        dep.addSub(this)
      }
    }
  }

  cleanupDep() {
    let i: number = this.dep.length
    while (i--) {
      const dep: DepInterface = this.dep[i]
      if (!this.newDepId.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp: Set<number> | Array<DepInterface> = this.depId
    this.depId = this.newDepId
    this.newDepId = tmp
    this.newDepId.clear()
    tmp = this.dep
    this.dep = this.newDep
    this.newDep = tmp
    this.newDep.length = 0
  }

  teardown() {
    if (this.active) {
      let i: number = this.dep.length
      while (i--) {
        this.dep[i].removeSub(this)
      }
      this.dep = []
      this.active = false
    }
  }
}
