import { h, VNode } from 'virtual-dom'
import RD from '../../src/index'

export default function createElement(ctx, tag, properties, ...children) {
  if (typeof tag === 'function' || typeof tag === 'object') {
    let node = new VNode()
    node.tagName = `component-${tag.cid}`
    node.properties = properties
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
