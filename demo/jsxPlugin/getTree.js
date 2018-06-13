import {create, VNode} from 'virtual-dom'
import {Dep} from "../../src/toolbox/Dep";

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
        node.component.$vnode = node.component.$createNodeTree(node.properties)
        treeNode = node.component.$vnode
      }
      if (treeNode.children) {
        treeNode = createTree(treeNode)
      }
      if (node.isComponent) {
        node.component._vnode = treeNode
        Object.defineProperty(node.component, '$el', {
          configurable: true,
          enumerable: true,
          get() {
            return treeNode.$el
          },
          set(el) {
          }
        })
      }
      return treeNode
    })
  }
  return tree
}

function getOldComponent(list = [], cid) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (!list[i].used && list[i].componentClass.cid === cid) {
      list[i].used = true
      return list[i].component
    }
  }
}

function getOldTag(list = [], tagName) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (!list[i].used && list[i].tagName === tagName) {
      list[i].used = true
      return list[i]
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
          node.component.$vnode = node.component.$createNodeTree(node.properties)
          treeNode = node.component.$vnode
          isNewComponent = true
        } else {
          treeNode = node.component._vnode
        }
      }

      if (!(treeNode.children && treeNode.children.length !== 0)) {
        if (isNewComponent) {
          treeNode = createTree(treeNode)
        } else {
          console.log(treeNode)
          treeNode = changeTree(treeNode, getOldTag(oldTemplate.children, node.tagName))
        }
      }
      if (isNewComponent) {
        node.component._vnode = treeNode
        Object.defineProperty(node.component, '$el', {
          configurable: true,
          enumerable: true,
          get() {
            return treeNode.$el
          },
          set(el) {
          }
        })
      }
      return treeNode
    })
  }
  return tree
}

export default function getTree(newTemplate, oldTemplate) {
  let tree = null
  if (!oldTemplate) {
    tree = createTree(newTemplate)
  } else {
    console.log('change')
    tree = changeTree(newTemplate, oldTemplate)
  }
  return tree
}