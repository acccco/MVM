type arrayT<T> = T[] | T;

let uid = 0;

export default class Event {
  id: number;
  _event: {
    [eventName: string]: Array<Function> | null;
  };

  constructor() {
    this.id = uid++;
    this._event = {};
  }

  on(eventName: arrayT<string>, fn: arrayT<Function>) {
    if (Array.isArray(eventName)) {
      eventName.forEach((name) => this.on(name, fn));
      return;
    }
    if (!this._event[eventName]) {
      this._event[eventName] = [];
    }
    if (Array.isArray(fn)) {
      this._event[eventName]?.push(...fn);
    } else {
      this._event[eventName]?.push(fn);
    }
    return this;
  }

  once(eventName: string, fn: Function) {
    let proxyFun: Function = (...args: any[]) => {
      this.off(eventName, proxyFun);
      fn.apply(this, args);
    };

    // @ts-ignore
    proxyFun.fn = fn;

    this.on(eventName, proxyFun);
    return this;
  }

  off(eventName?: arrayT<string>, fn?: arrayT<Function>) {
    // 清空所有事件
    if (!eventName) {
      this._event = {};
      return this;
    }
    // 清空多个事件
    if (Array.isArray(eventName)) {
      eventName.forEach((name) => this.off(name, fn));
      return this;
    }
    // 若没有事件对应的函数列表则不用处理
    const cbs = this._event[eventName];
    if (!cbs) {
      return this;
    }
    // 清空特定事件
    if (!fn) {
      this._event[eventName] = null;
      return this;
    }
    // 取消特定事件的特定处理函数
    let cb;
    let i = cbs.length;
    // 处理一次取消多个的情况
    if (Array.isArray(fn)) {
      fn.forEach((fnc) => this.off(eventName, fnc));
      return this;
    }
    while (i--) {
      cb = cbs[i];
      // @ts-ignore
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break;
      }
    }
    return this;
  }

  emit(eventName: string, ...args: Array<any>) {
    let cbs = this._event[eventName];
    if (cbs) {
      cbs.forEach((func) => func.apply(this, args));
    }
    return this;
  }
}
