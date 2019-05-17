import {DepInterface} from "../type/dep"
import {WatcherInterface} from "../type/watcher"

let uid = 0

/**
 * 对象下的每一条属性都对应一个单独 Dep 对象，用于管理依赖
 * 当属性进行 get 时，Dep 收集依赖
 * 当属性进行 set 是，Dep 触发依赖
 * monitor 属性保存对应的属性名和属性所属的对象
 * 如果 monitor.key 为 this 说明该 Dep 对象用于整个对象
 */
export class Dep implements DepInterface {

  static target: null | WatcherInterface

  id: number
  monitor: {
    object: Object
    key: string
  }
  subs: Array<WatcherInterface>

  constructor(object: Object, key: string) {
    this.id = uid++
    this.monitor = {
      object,
      key
    }
    this.subs = []
  }

  /**
   * 添加一个 watcher 到当前 dep 中
   * @param {WatcherInterface} sub
   */
  addSub(sub: WatcherInterface) {
    for (let i = 0; i < this.subs.length; i++) {
      if (this.subs[i].id === sub.id) {
        return
      }
    }
    this.subs.push(sub)
  }

  /**
   * 从当前 dep 中删除指定的 watcher
   * @param {WatcherInterface} sub
   */
  removeSub(sub: WatcherInterface) {
    const index = this.subs.indexOf(sub)
    if (index > -1) {
      this.subs.splice(index, 1)
    }
  }

  /**
   * 触发当前 dep 下的所有 watcher
   */
  notify() {
    this.subs.forEach(sub => sub.update())
  }
}

Dep.target = null

const targetStack: Array<WatcherInterface> = []

/**
 * 将旧的 target 推入栈中，Dep.target 赋值为新的 target
 * @param {WatcherInterface} target
 */
export function pushTarget(target: WatcherInterface | null) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = target
}

/**
 * 从 targetStack 中推出 watcher，赋值给 Dep.target
 */
export function popTarget() {
  Dep.target = targetStack.pop() || null
}
