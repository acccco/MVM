import {VNode, VText} from 'virtual-dom'

function extend(source, extend) {
  for (let key in extend) {
    source[key] = extend[key]
  }
  return source
}

function createTree(template) {
  let tree = extend(new VNode(), template)
  if (template && template.children) {
    tree.children = template.children.map(node => {
      let treeNode = node
      if (node.isComponent) {
        node.component = new node.componentClass({parent: node.parent, propData: node.properties})
        treeNode = node.component.$vnode = node.component.$createComponentVNode(node.properties)
        treeNode.component = node.component
      }
      if (treeNode.children) {
        treeNode = createTree(treeNode)
      }
      if (node.isComponent) {
        node.component._vnode = treeNode
      }
      return treeNode
    })
  }
  return tree
}

function getOldComponent(list = [], cid) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (!list[i].used && list[i].isComponent && list[i].componentClass.cid === cid) {
      list[i].used = true
      return list[i].component
    }
  }
}

function changeTree(newTemplate, oldTemplate) {
  let tree = extend(new VNode(), newTemplate)
  if (newTemplate && newTemplate.children) {
    tree.children = newTemplate.children.map((node, index) => {
      let treeNode = node
      let isNewComponent = false
      if (treeNode.isComponent) {
        node.component = getOldComponent(oldTemplate.children, treeNode.componentClass.cid)
        if (!node.component) {
          node.component = new node.componentClass({parent: node.parent, propData: node.properties})
          node.component.$vnode = node.component.$createComponentVNode(node.properties)
          treeNode = node.component.$vnode
          treeNode.component = node.component
          isNewComponent = true
        } else {
          node.component.$initProp(node.properties)
          treeNode = node.component._vnode
          treeNode.component = node.component
        }
      }

      if (treeNode.children && treeNode.children.length !== 0) {
        if (isNewComponent) {
          treeNode = createTree(treeNode)
        } else {
          if (oldTemplate && oldTemplate.children) {
            treeNode = changeTree(treeNode, oldTemplate.children[index])
          } else {
            treeNode = createTree(treeNode)
          }
        }
      }
      if (isNewComponent) {
        node.component._vnode = treeNode
      }
      return treeNode
    })
    if (oldTemplate && oldTemplate.children.length !== 0)
      for (let i = 0, len = oldTemplate.children.length; i < len; i++) {
        if (oldTemplate.children[i].isComponent && !oldTemplate.children[i].used) {
          oldTemplate.children[i].component.$destroy()
        }
      }
  }
  return tree
}

function deepClone(node) {
  if (node.type === 'VirtualNode') {
    let children = []
    if (node.children && node.children.length !== 0) {
      children = node.children.map(node => deepClone(node))
    }
    let cloneNode = new VNode(node.tagName, node.properties, children)
    if (node.component) cloneNode.component = node.component
    return cloneNode
  } else if (node.type === 'VirtualText') {
    return new VText(node.text)
  }
}

export default function getTree(newTemplate, oldTemplate) {
  let tree = null
  if (!oldTemplate) {
    tree = createTree(newTemplate)
  } else {
    tree = changeTree(newTemplate, oldTemplate)
  }

  return deepClone(tree)
}