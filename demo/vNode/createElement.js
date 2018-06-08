import {h} from 'virtual-dom'

export default function createElement(tagName, properties, ...children) {

  if (typeof tagName === 'function') {
    let parent = createElement.componentParent
    if (parent.componentList === undefined) {
      parent.componentList = {}
    }
    let comp = null
    if (parent.componentList[properties.key]) {
      comp = parent.componentList[properties.key]
    } else {
      comp = new tagName({parent: parent, propData: properties})
      comp.initWatch()
      parent.componentList[properties.key] = comp
    }
    let nodeTree = comp.$createNodeTree(properties)
    nodeTree.component = comp
    nodeTree.nid = comp.id
    return nodeTree
  }

  return h(tagName, properties, children)
}