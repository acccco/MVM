import {h} from 'virtual-dom'

export default function createElement(tag, properties, ...children) {

  if (typeof tag === 'function') {
    let parent = createElement.componentParent
    if (parent.componentList === undefined) {
      parent.componentList = {}
    }
    let comp = null
    if (parent.componentList[properties.key]) {
      comp = parent.componentList[properties.key]
    } else {
      comp = new tag({parent: parent, propData: properties})
      comp.initWatch()
      parent.componentList[properties.key] = comp
    }
    return comp.$createNodeTree(properties)
  }

  return h(tag, properties, children)
}