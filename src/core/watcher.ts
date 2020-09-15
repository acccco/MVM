import Dep from "./dep";
import traverse from "../util/watcher-traverse";
import watcherQueue from "../util/watcher-queue";

export type watcherCallback = (newValue: any, oldValue: any) => any;

let uid: number = 0;

export default class Watcher {
  id: number;
  active: boolean;
  dirty: boolean;
  getter: () => any;
  callback: watcherCallback;
  dep: Dep[];
  depId: Set<number>;
  newDep: Dep[];
  newDepId: Set<number>;
  value: any;

  constructor(getter: () => any, callback: watcherCallback) {
    this.id = uid++;
    this.active = true;
    this.getter = getter;
    this.callback = callback;
    this.dep = [];
    this.depId = new Set();
    this.newDep = [];
    this.newDepId = new Set();
    this.value = this.get();
    this.dirty = false;
  }

  get(): any {
    Dep.pushTarget(this);
    let value = this.getter();
    traverse(value);
    Dep.popTarget();
    this.cleanDep();
    return value;
  }

  update(): void {
    watcherQueue(this);
  }

  run(): void {
    if (this.active) {
      let value = this.get();
      if (value !== this.value || typeof value === "object") {
        // 设置新值
        const oldValue = this.value;
        this.value = value;
        this.callback(value, oldValue);
      }
    }
  }

  evaluate(): void {
    this.value = this.getter();
    this.dirty = false;
  }

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
