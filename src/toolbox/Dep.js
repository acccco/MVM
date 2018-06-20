let uid = 0

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

export function pushTarget (target) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}

