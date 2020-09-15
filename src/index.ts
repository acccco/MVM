import Event from "./core/event";
import Watcher, { watcherCallback } from "./core/watcher";
import Dep from "./core/dep";
import { observe } from "./core/observe";

let uid = 0;

export default class ReactiveData<
  T extends { [prop: string]: any } = {}
> extends Event {
  id: number = uid++;
  active: boolean = true;

  data: T = {} as T;
  watchQueue: Watcher[] = [];

  constructor() {
    super();
    Promise.resolve().then(() => {
      observe(this.data);
      this.computedHook();
      this.watchHook();
    });
  }

  computedHook() {}
  watchHook() {}

  addComputed(
    key: string,
    getCall: (data: T) => any,
    setCall: (data: T, ...args: any[]) => void = (data) => {},
  ) {
    let _this = this;
    let dep = new Dep(this.data, key);
    Object.defineProperty(this.data, key, {
      configurable: true,
      enumerable: true,
      get() {
        if (Dep.target) {
          Dep.target.addDep(dep);
        }
        return getCall(_this.data);
      },
      set(newValue) {
        setCall(_this.data, newValue);
      },
    });
  }

  addWatch(getter: string | (() => any), callback: watcherCallback): Watcher {
    if (typeof getter === "string") {
      let names = getter.split(".");
      getter = () => names.reduce((res, name) => res.data[name], this);
    }
    let watch = new Watcher(getter, callback);
    this.watchQueue.push(watch);
    return watch;
  }

  destroy() {
    if (this.active) {
      while (this.watchQueue.length) {
        this.watchQueue.shift()?.destroy();
      }
      // 清空事件
      this.off();
      this.active = false;
    }
  }
}
