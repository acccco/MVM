import { is } from "ramda";
import Watcher from "../core/watcher";
import ReactiveData from "../";
import { observe, observeComputed } from "../core/observe";
import { warn, proxyObject, checkProp } from "./util";

export default function initState(rd: ReactiveData) {
  let opt = rd.$option;
  if (opt.data) initData(rd);
  if (opt.computed) initComputed(rd);
  if (opt.method) initMethod(rd);
  if (opt.watch) initWatch(rd);
}

function initData(rd: ReactiveData) {
  if (!is(Function, rd.$option.data)) {
    warn("data 必须是一个函数", rd);
    return;
  }
  rd._data = rd.$option.data ? rd.$option.data.call(rd) : {};
  if (!is(Object, rd._data)) {
    warn("data 函数的返回值必须是一个对象", rd);
    return;
  }
  observe(rd._data);
  proxyObject(rd, rd._data, (key) => checkProp(key, "data", rd));
}

function initComputed(rd: ReactiveData) {
  for (let key in rd.$option.computed) {
    rd._computed[key] = {
      set: rd.$option.computed[key].set.bind(rd),
      get: rd.$option.computed[key].get.bind(rd),
    };
  }
  observeComputed(rd._computed);
  proxyObject(rd, rd._computed, (key) => checkProp(key, "computed", rd));
}

function initMethod(rd: ReactiveData) {
  for (let key in rd.$option.method) {
    if (checkProp(key, "method", rd)) {
      rd[key] = rd.$option.method[key].bind(rd);
    }
  }
}

function initWatch(rd: ReactiveData) {
  for (let key in rd.$option.watch) {
    rd.$option.watch[key].forEach((item) => {
      rd._watch.push(
        new Watcher(
          rd,
          () => {
            return key.split(".").reduce((obj, name) => obj[name], rd);
          },
          item.callback,
        ),
      );
    });
  }
}
