import Dep from './Dep'
import {traverse} from "../util/traverse";

let uid = 0

export class Watcher {

    constructor(ctx, getter, callback, options) {
        this.id = ++uid

        if (options) {
            this.lazy = !!options.lazy
            this.deep = !!options.deep
        } else {
            this.lazy = this.deep = false
        }

        this.ctx = ctx
        this.getter = getter
        this.cb = callback
        this.deps = []
        this.value = this.init()
        this.dirty = this.lazy
    }

    init() {
        Dep.target = this
        let value = this.getter.call(this.ctx)
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
            return
        }
        const value = this.getter.call(this.ctx)
        const oldValue = this.value
        this.value = value
        this.cb.call(this.ctx, value, oldValue)
    }

    /**
     * 脏检查机制手动触发更新函数
     */
    evaluate() {
        this.value = this.getter.call(this.ctx)
        this.dirty = false
    }

    addDep(dep) {
        this.deps.push(dep)
    }

    teardown() {
        let i = this.deps.length
        while (i--) {
            this.deps[i].removeSub(this)
        }
        this.deps = []
    }

}