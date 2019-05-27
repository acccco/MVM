import { h } from 'virtual-dom'
import RD from '../../src/index'

// 用于存储使用过的组件类
let classMap = new Map()
// 用于储存每个组件类实例使用过的组件实例
let storeMap = {}

function clone(source) {
  let res = {}
  for (let key in source) {
    if (typeof source[key] === 'object') {
      res[key] = clone(source[key])
    } else {
      res[key] = source[key]
    }
  }
  return res
}

export function createElement(ctx, tag, properties, ...children) {
  if (typeof tag === 'function' || typeof tag === 'object') {

    // 获取对应组件类
    let componentClass = null
    if (typeof tag === 'object') {
      if (!classMap.has(tag)) {
        classMap.set(tag, RD.extend(tag))
      }
      componentClass = classMap.get(tag)
    }

    // 获取 prop 和 event
    let prop = {}
    let event = {}
    for (let key in  properties) {
      if (/^on-/.test(key)) {
        let eventName = key.replace(/on-/, '')
        if (properties[key] instanceof Function) {
          event[eventName] = properties[key]
        } else {
          event[eventName] = ctx[eventName] || null
        }
      } else {
        if (typeof properties[key] === 'object') {
          prop[key] = clone(properties[key])
        } else {
          prop[key] = properties[key]
        }
      }
    }

    // 获取已经实例化过的组件实例
    if (!storeMap[ctx.id]) {
      storeMap[ctx.id] = { oldMap: {}, newMap: {} }
    }
    let oldMap = storeMap[ctx.id].oldMap
    let newMap = storeMap[ctx.id].newMap

    let component = null

    if (oldMap[componentClass.cid] && oldMap[componentClass.cid].length > 0) {
      component = oldMap[componentClass.cid].pop()
    } else {
      component = new componentClass({ parent: ctx, propData: prop, event: event })
    }

    if (!newMap[componentClass.cid]) {
      newMap[componentClass.cid] = []
    }
    newMap[componentClass.cid].push(component)

    return ctx.$cancelWatch(() => component.$createComponentVNode(prop))
  }

  return h(tag, properties, children)
}

export function resetMap(ctx) {
  let cid = ctx.constructor.cid
  if (!storeMap[cid]) return
  for (let key in storeMap[cid].oldMap) {
    storeMap[cid].oldMap[key].forEach(component => component.$destroy())
  }
  storeMap[cid].oldMap = storeMap[cid].newMap
  storeMap[cid].newMap = {}
}
