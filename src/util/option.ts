import { clone, is } from "ramda";
import { noop } from "./util";
import { LIFECYCLE_HOOK } from "./lifecycle";
import { watcherCallback } from "../core/watcher";
import { optionType, watchOption, computedOption } from "..";

type arrayT<T> = T[] | T;

function isUserPrams(key: string): boolean {
  let list = [...LIFECYCLE_HOOK, "data", "computed", "method", "watch"];
  return list.indexOf(key) === -1;
}

export default function mergeOption(
  host: optionType = {},
  customer: Partial<optionType> = {},
): optionType {
  let formatedCustomer = formatOption(customer);

  let option = clone(host);

  // 合并 data
  option.data = mergeFunction(option.data, formatedCustomer.data);

  // 合并 watcher 同名合并成一个数组
  option.watch = mergeWatch(option.watch, formatedCustomer.watch);

  // 合并生命周期函数
  LIFECYCLE_HOOK.forEach((name: string) => {
    if (formatedCustomer[name]) {
      option[name].push(...formatedCustomer[name]);
    }
  });

  // 其他属性以 customer 为准
  for (let key in formatedCustomer) {
    if (isUserPrams(key)) {
      option[key] = formatedCustomer[key];
    }
  }

  return option;
}

function mergeFunction(
  host: () => object = noop,
  customer: () => object = noop,
): () => object {
  // TODO: data 函数的 this 指向
  return function mergeFnc(this: any) {
    return { ...host.call(this), ...customer.call(this) };
  };
}

function mergeWatch(
  host: watchOption = {},
  customer: watchOption = {},
): watchOption {
  let watch = clone(host);
  for (let key in customer) {
    if (!watch[key]) {
      watch[key] = [];
    }
    watch[key].push(...customer[key]);
  }
  return watch;
}

function formatOption(option: Partial<optionType>): optionType {
  let res: optionType = {};
  let map: any = {
    computed: normalizeComputed,
    watch: normalizeWatch,
  };

  LIFECYCLE_HOOK.forEach((name: string) => {
    map[name] = normalizeLifecycle;
  });

  for (let key in option) {
    if (map[key]) {
      res[key] = map[key](option[key]);
    } else {
      res[key] = option[key];
    }
  }

  return res;
}

function normalizeComputed(computed: {
  [computedName: string]: computedOption[string] | Function;
}): computedOption {
  let normalComputed: computedOption = {};

  for (let key in computed) {
    if (is(Function, computed[key])) {
      normalComputed[key] = {
        get: computed[key] as Function,
        set: noop,
      };
    } else {
      normalComputed[key] = computed[key] as computedOption[string];
    }
  }
  return normalComputed;
}

function normalizeWatch(watch: {
  [watcherName: string]: arrayT<watcherCallback | watchOption[string][number]>;
}): watchOption {
  let normalWatch: watchOption = {};

  function format(
    watch: watcherCallback | watchOption[string][number],
  ): watchOption[string][number] {
    if (is(Object, watch)) {
      return {
        callback: (watch as watchOption[string][number]).callback,
      };
    } else {
      return {
        callback: watch as watcherCallback,
      };
    }
  }

  for (let key in watch) {
    let watchs = watch[key];
    if (Array.isArray(watchs)) {
      normalWatch[key] = watchs.map((watch) => format(watch));
    } else {
      normalWatch[key] = [format(watchs)];
    }
  }

  return normalWatch;
}

function normalizeLifecycle(lifecycle: arrayT<Function>): Function[] {
  if (is(Function, lifecycle)) {
    return [<Function>lifecycle];
  }
  if (Array.isArray(lifecycle)) {
    return lifecycle;
  }
  return [];
}
