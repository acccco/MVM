import Watcher from "./watcher";

let uid = 0;

/**
 * 对象下的每一条属性都对应一个单独 Dep 对象，用于管理依赖
 * 当属性进行 get 时，Dep 收集依赖
 * 当属性进行 set 是，Dep 触发依赖
 * monitor 属性保存对应的属性名和属性所属的对象
 * 如果 monitor.key 为 this 说明该 Dep 对象用于整个对象
 */
export default class Dep {
  static target: null | Watcher = null;
  static targetStack: Array<Watcher | null> = [];

  static pushTarget(target: Watcher | null) {
    if (Dep.target || Dep.target === null) Dep.targetStack.push(Dep.target);
    Dep.target = target;
  }

  static popTarget() {
    Dep.target = Dep.targetStack.pop() || null;
  }

  id: number;
  monitor: {
    object: Object;
    key: string;
  };
  watchs: Array<Watcher>;

  constructor(object: Object, key: string) {
    this.id = uid++;
    this.monitor = {
      object,
      key,
    };
    this.watchs = [];
  }

  /**
   * 添加订阅
   * @param {Watcher} sub
   */
  subscribe(watch: Watcher) {
    for (let i = 0; i < this.watchs.length; i++) {
      if (this.watchs[i].id === watch.id) {
        return;
      }
    }
    this.watchs.push(watch);
  }

  /**
   * 移除订阅
   * @param {Watcher} watch
   */
  unsubscribe(watchId: Watcher | number) {
    if (typeof watchId !== "number") {
      watchId = watchId.id;
    }
    const index = this.watchs.findIndex((watch) => watch.id === watchId);
    if (index !== -1) {
      this.watchs.splice(index, 1);
    }
  }

  /**
   * 触发当前 dep 下的所有 watcher
   */
  notify() {
    this.watchs.forEach((watch) => watch.update());
  }
}
