import {h} from 'virtual-dom'

export default function createElement(tagName, properties, ...children) {
  if (typeof tagName === 'function') {
    var parent = createElement.componentParent
    var key = properties.key
    delete properties.key
    var comp = null

    if (parent && !parent.component) {
      parent.component = {}
    }
    if (!parent.component[tagName.cid]) {
      parent.component[tagName.cid] = {}
    }
    if (key in parent.component[tagName.cid]) {
      comp = parent.component[tagName.cid][key]
    } else {
      comp = new tagName({parent: parent, propData: properties})
      comp.$initWatch()
      parent.component[tagName.cid][key] = comp
    }

    return comp.$getNodeTree(properties)
  }
  return h(tagName, properties, children)
}