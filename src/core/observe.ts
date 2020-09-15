import { is } from "ramda";
import Dep from "./dep";
import arrayMethods from "../util/array-fix";

let uid = 0;

class Observer {
  id: number = uid++;
  dep: Dep;

  constructor(value: Object | Array<any>) {
    this.dep = new Dep(value, "this");
    // 处理数组
    if (Array.isArray(value)) {
      // 将处理过的数组方法设置成数组的原型
      Object.setPrototypeOf(value, arrayMethods);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
    Object.defineProperty(value, "__ob__", {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true,
    });
  }

  /**
   * 遍历对象下属性，使得属性变成可监听的结构
   * @param {Object} obj
   */
  walk(obj: { [key: string]: any }) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]]);
    }
  }

  /**
   * 同上，遍历数组
   * @param {Array<any>} items
   */
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}

export function defineReactive(object: Object, key: string, value: any) {
  let dep = new Dep(object, key);
  let childOb = observe(value);
  Object.defineProperty(object, key, {
    configurable: true,
    enumerable: true,
    get() {
      if (Dep.target) {
        dep.subscribe(Dep.target);
        Dep.target.addDep(dep);
        if (Array.isArray(value)) {
          childOb.dep.subscribe(Dep.target);
          Dep.target.addDep(childOb.dep);
        }
      }
      return value;
    },
    set(newValue) {
      value = newValue;
      if (is(Object, newValue)) {
        observe(newValue);
      }
      dep.notify();
    },
  });
}

export function observe(value: any) {
  if (typeof value !== "object") {
    return;
  }
  if (value.hasOwnProperty("__ob__") && value.__ob__ instanceof Observer) {
    return value.__ob__;
  } else if (Object.isExtensible(value)) {
    return new Observer(value);
  }
}
