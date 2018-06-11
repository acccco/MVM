import {is} from './util'

const seenObjects = new Set()

/**
 * watch & deep 的时候需要对对象进行深度监听，对该对象进行一次深遍历即可
 */
export function traverse(val) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}

function _traverse(val, seen) {
  let i, keys
  const isA = Array.isArray(val)
  if ((!isA && !is(Object, val)) || Object.isFrozen(val)) {
    return
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
