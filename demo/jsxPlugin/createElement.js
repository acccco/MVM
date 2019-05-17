import { h, VNode } from 'virtual-dom'
import RD from '../../src/index'

export default function createElement(ctx, tag, properties, ...children) {
  if (typeof tag === 'function' || typeof tag === 'object') {
    let node = new VNode()
    node.event = {}
    node.properties = {}
    for (let key in  properties) {
      if (/^on-/.test(key)) {
        let eventName = key.replace(/on-/, '')
        if (properties[key] instanceof Function) {
          node.event[eventName] = properties[key]
        } else {
          node.event[eventName] = ctx[eventName] || (() => {
          })
        }
      } else {
        node.properties[key] = properties[key]
      }
    }
    node.tagName = `component-${tag.cid}`
    node.children = children
    node.parent = ctx
    node.isComponent = true
    if (typeof tag === 'function') {
      node.ComponentClass = tag
    } else {
      node.ComponentClass = RD.extend(tag)
    }
    return node
  }

  return h(tag, properties, children)
}
