import {h} from 'virtual-dom'

export default function createElement(tag, properties, ...children) {

  if (typeof tag === 'function') {
    let parent = createElement.componentParent
    if (parent.componentList === undefined) {
      parent.componentList = {}
    }
    let comp = null
    let nodeTree = null
    if (parent.componentList[properties.key]) {
      comp = parent.componentList[properties.key]
      nodeTree = comp.$createNodeTree(properties)
    } else {
      comp = new tag({parent: parent, propData: properties})
      comp.$watch(() => {
        nodeTree = comp.$createNodeTree(properties)
      }, () => {
        comp.$root.$patch()
      }, {
        ignoreChange: true
      })
      parent.componentList[properties.key] = comp
    }
    return nodeTree
  }

  return h(tag, properties, children)
}