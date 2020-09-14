import Dep from "./dep";
import ReactiveData from "./reactive-data";
import traverse from "../watch/traverse";
import watcherQueue from "../watch/watcherQueue";

export type watcherCallback = (newValue: any, oldValue: any) => any;

let uid: number = 0;

export default class Watcher {
  id: number;
  active: boolean;
  dirty: boolean;
  getter: () => any;
  callback: watcherCallback;
  dep: Array<Dep>;
  depId: Set<number>;
  newDep: Array<Dep>;
  newDepId: Set<number>;
  value: any;

  constructor(ctx: ReactiveData, getter: Function, callback: watcherCallback) {
    this.id = uid++;
    this.active = true;
    this.getter = getter.bind(ctx);
    this.callback = callback.bind(ctx);
    this.dep = [];
    this.depId = new Set();
    this.newDep = [];
    this.newDepId = new Set();
    this.value = this.get();
    this.dirty = false;
  }

  /**
   * 用于计算 watcher 的值，并且在相关属性下添加依赖
   * @returns {any}
   */
  get(): any {
    Dep.pushTarget(this);
    let value = this.getter();
    traverse(value);
    Dep.popTarget();
    this.cleanDep();
    return value;
  }

  /**
   * 当响应属性变化时，触发 watcher 更新，由 dep 调用
   */
  update(): void {
    watcherQueue(this);
  }

  /**
   * watcher 执行更新
   */
  run(): void {
    if (this.active) {
      let value = this.get();
      if (value !== this.value) {
        // 设置新值
        const oldValue = this.value;
        this.value = value;
        this.callback(value, oldValue);
      }
    }
  }

  /**
   * 脏检查机制手动触发更新函数
   */
  evaluate(): void {
    this.value = this.getter();
    this.dirty = false;
  }

  /**
   * 添加依赖的 dep
   * @param {Dep} dep
   */
  addDep(dep: Dep): void {
    const id = dep.id;
    if (!this.newDepId.has(id)) {
      this.newDep.push(dep);
      this.newDepId.add(id);
      if (!this.depId.has(id)) {
        dep.subscribe(this);
      }
    }
  }

  /**
   * 清空无效的 dep 和 当前 watcher 的关联
   */
  cleanDep(): void {
    let i = this.dep.length;
    while (i--) {
      const dep = this.dep[i];
      if (!this.newDepId.has(dep.id)) {
        dep.unsubscribe(this);
      }
    }
    let tmp: any = this.depId;
    this.depId = this.newDepId;
    this.newDepId = tmp;
    this.newDepId.clear();
    tmp = this.dep;
    this.dep = this.newDep;
    this.newDep = tmp;
    this.newDep.length = 0;
  }

  destroy(): void {
    if (this.active) {
      let i = this.dep.length;
      // 清除 dep 对 watcher 的引用
      while (i--) {
        this.dep[i].unsubscribe(this);
      }
      // 清除 watcher 对 dep 的引用
      this.dep = [];
      this.active = false;
    }
  }
}
