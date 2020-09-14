import Event from "./core/event";
import Watcher, { watcherCallback } from "./core/watcher";
import initEvent from "./util/event";
import { callHook } from "./util/lifecycle";
import mergeOption from "./util/option";
import initState from "./util/state";
import { allowedGlobals, warn } from "./util/util";

type lifeCycleFun = () => any;

export type computedOption = {
  [name: string]: { set: Function; get: Function };
};

export type watchOption = {
  [name: string]: {
    callback: watcherCallback;
  }[];
};

export type optionType = {
  data?: () => object;
  computed?: computedOption;
  method?: {
    [propName: string]: () => any;
  };
  watch?: watchOption;
  beforeCreate?: lifeCycleFun[];
  created?: lifeCycleFun[];
  beforeDestroy?: lifeCycleFun[];
  destroyed?: lifeCycleFun[];

  [key: string]: any;
};

let uid = 0;

export default class ReactiveData extends Event {
  static version: string;
  static option: optionType;

  id: number;
  active: boolean;
  $option: optionType;
  _data: object;
  _computed: computedOption;
  _watch: Watcher[];
  _proxy: WindowProxy | this;

  [key: string]: any;

  constructor(option: optionType) {
    super();
    this.id = uid++;
    this.active = true;
    // 合并参数
    this.$option = mergeOption((this.constructor as any).option, option);
    this._data = {};
    this._computed = {};
    this._watch = [];

    // 使用代理拦截属性的获取，得到错误信息
    this._proxy = Proxy
      ? new Proxy(this, {
          has(target, key) {
            return key in target || !allowedGlobals(<string>key);
          },
          get(target, key): any {
            if (typeof key === "string" && !(key in target)) {
              warn(
                `data/prop/method/computed 下未定义 ${key} 请检查。`,
                target,
              );
            }
            // @ts-ignore
            return target[key];
          },
        })
      : this;

    this._init(option);
  }

  /**
   * 初始化 RD 实例
   * @param     {optionType} option
   * @returns   {void}
   * @private
   */
  _init(option: optionType): void {
    // 触发 beforeCreate 事件
    callHook(this, "beforeCreate");
    initState(this);

    // 触发 created 事件
    callHook(this, "created");
    initEvent(this);
  }

  /**
   * 创建一个观察者，观察者会观察在 getter 中对属性的 get 的操作
   * 当对应属性发生 set 动作并且值发生变化时时，会触发 callback
   * 新生成的观察者对象会保存在实例的 _watch 属性下
   */
  $watch(getter: string | Function, callback: watcherCallback): Watcher {
    if (typeof getter === "string") {
      getter = () => {
        (getter as string).split(".").reduce((res, name) => res[name], this);
      };
    }
    let watch = new Watcher(this, getter, callback);
    this._watch.push(watch);
    return watch;
  }

  /**
   * 销毁当前实例
   */
  $destroy() {
    if (this.active) {
      callHook(this, "beforeDestroy");

      // 注销 watch
      while (this._watch.length) {
        // @ts-ignore
        this._watch.shift().destroy();
      }

      // 清空事件
      this.off();

      callHook(this, "destroyed");
      this.active = false;
    }
  }
}
