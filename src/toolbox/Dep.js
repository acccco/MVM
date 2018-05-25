let uid = 0

export default class Dep {

  constructor() {
    this.id = ++uid
    this.subs = []
  }

  addSub(sub) {
    let flag = false
    for (let i = 0; i < this.subs.length; i++) {
      if (this.subs[i].id === sub.id) {
        flag = true
        break
      }
    }
    if (!flag) {
      this.subs.push(sub)
    }
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

