import { is } from "ramda";

type objOrArray = {
  [index: number]: any;
  [propName: string]: any;
};

const seen = new Set<number>();

export default function traverse(val: objOrArray) {
  _traverse(val, seen);
  seen.clear();
}

function _traverse(val: objOrArray, seen: Set<number>) {
  let i: number;
  let keys: Array<string | number>;
  const isArray = Array.isArray(val);
  const isObject = is(Object, val);

  if ((!isArray && !isObject) || Object.isFrozen(val)) {
    return;
  }

  // 对象已遍历
  if (val.__ob__) {
    const depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return;
    }
    seen.add(depId);
  }

  if (isArray) {
    i = val.length;
    while (i--) _traverse(val[i], seen);
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) _traverse(val[keys[i]], seen);
  }
}
