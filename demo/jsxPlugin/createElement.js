import {h, VNode} from 'virtual-dom'

export default function createElement(ctx, tag, properties, ...children) {

  if (typeof tag === 'function') {
    let node = new VNode()
    node.tagName = `component-${tag.cid}`
    node.properties = properties
    node.children = children
    node.parent = ctx
    node.isComponent = true
    node.componentClass = tag
    return node
  }

  return h(tag, properties, children)
}