let uid = 0

/**
 * 对象下的每一条属性都对应一个单独 Dep 对象，用于管理依赖
 * 当属性进行 get 时，Dep 收集依赖
 * 当属性进行 set 是，Dep 触发依赖
 * monitor 属性用于保存 对应的属性名和属性所属的对象
 * 如果 monitor.key 为 this 说明该 Dep 对象用于整个对象
 */
export class Dep {

  constructor(object, key) {
    this.id = uid++
    this.monitor = {
      object,
      key
    }
    this.subs = []
  }

  addSub(sub) {
    for (let i = 0; i < this.subs.length; i++) {
      if (this.subs[i].id === sub.id) {
        return
      }
    }
    this.subs.push(sub)
  }

  removeSub(sub) {
    const index = this.subs.indexOf(sub)
    if (index > -1) {
      this.subs.splice(index, 1)
    }
  }

  notify() {
    this.subs.forEach(sub => sub.update())
  }
}

Dep.target = null

const targetStack = []

export function pushTarget(target) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = target
}

export function popTarget() {
  Dep.target = targetStack.pop()
}

