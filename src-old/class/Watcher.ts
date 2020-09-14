import {DepInterface} from "../type/dep"
import {WatcherInterface, watcherCallback, watcherOption} from "../type/watcher"
import {RDInterface} from "../type/rd"

import {pushTarget, popTarget} from './Dep'
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
  initCallback: boolean
  getter: () => any
  cb: watcherCallback
  dep: Array<DepInterface>
  depId: Set<number>
  newDep: Array<DepInterface>
  newDepId: Set<number>
  value: any

  constructor(ctx: RDInterface, getter: Function, callback: watcherCallback, options: watcherOption = {}) {
    this.id = uid++
    this.active = true

    if (options) {
      this.lazy = !!options.lazy
      this.deep = !!options.deep
      // 为 true 即为: 不需要判断 getter 的返回值是否变化，当有绑定属性变化时，直接执行 callback
      this.ignoreChange = !!options.ignoreChange
      this.initCallback = !!options.initCallback
    } else {
      this.lazy = this.deep = this.ignoreChange = this.initCallback = false
    }

    this.getter = getter.bind(ctx)
    this.cb = callback.bind(ctx)
    this.dep = []
    this.depId = new Set()
    this.newDep = []
    this.newDepId = new Set()
    this.value = this.get()
    this.dirty = false

    if (this.initCallback) {
      callback(this.value, null)
    }
  }

  /**
   * 用于计算 watcher 的值，并且在相关属性下添加依赖
   * @returns {any}
   */
  get(): any {
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

  /**
   * 当响应属性变化时，触发 watcher 更新，由 dep 调用
   */
  update(): void {
    if (this.lazy) {
      this.dirty = true
    } else {
      watcherQueue(this)
    }
  }

  /**
   * watcher 执行更新
   */
  run(): void {
    if (this.active) {
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
  evaluate(): void {
    this.value = this.getter()
    this.dirty = false
  }

  /**
   * 添加依赖的 dep
   * @param {DepInterface} dep
   */
  addDep(dep: DepInterface): void {
    const id = dep.id
    if (!this.newDepId.has(id)) {
      this.newDep.push(dep)
      this.newDepId.add(id)
      if (!this.depId.has(id)) {
        dep.addSub(this)
      }
    }
  }

  /**
   * 清空无效的 dep 和 当前 watcher 的关联
   */
  cleanupDep(): void {
    let i = this.dep.length
    while (i--) {
      const dep = this.dep[i]
      if (!this.newDepId.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp: any = this.depId
    this.depId = this.newDepId
    this.newDepId = tmp
    this.newDepId.clear()
    tmp = this.dep
    this.dep = this.newDep
    this.newDep = tmp
    this.newDep.length = 0
  }

  /**
   * 销毁该 watcher
   */
  destroy(): void {
    if (this.active) {
      let i = this.dep.length
      // 清除 dep 对 watcher 的引用
      while (i--) {
        this.dep[i].removeSub(this)
      }
      // 清除 watcher 对 dep 的引用
      this.dep = []
      this.active = false
    }
  }
}
