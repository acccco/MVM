import {VNode, VText, create, diff, patch} from 'virtual-dom'
import {parse} from '../html-parse-stringify/index'
import {getProperties, runCodeRe} from "./util"
import {runCode} from "./outStrictMode"

function getVnode(ast, ctx, $index) {
  if (ast.length === 0) {
    return []
  }
  let children = []

  ast.forEach(item => {
    if (item.type === 'text') {
      if (item.content.trim()) {
        if (runCodeRe.test(item.content)) {
          children.push(new VText(runCode(item.content.replace(runCodeRe, '$1'), ctx, $index)))
        } else {
          children.push(new VText(item.content))
        }
      }
    }
    if (item.type === 'tag') {
      let len = 1
      if ('for' in item.attrs) {
        len = +item.attrs['for']
      }
      while (len > 0) {
        (function ($index) {
          children.push(new VNode(item.name, getProperties(item.attrs, ctx, $index), getVnode(item.children, ctx, $index)))
          len--
        })(len)
      }
    }
  })
  return children
}

export default {
  install(RD) {
    RD.prototype.$mount = function (el, template) {
      this.ASTtemplate = parse(template.trim())
      this.$watch(() => {
        return getVnode(this.ASTtemplate, this)[0]
      }, (newTree) => {
        this.$patch(newTree)
      })
      this.nodeTree = getVnode(this.ASTtemplate, this)[0]
      this.rootNode = create(this.nodeTree)
      el.appendChild(this.rootNode)
    }
    RD.prototype.$patch = function (newTree) {
      newTree = newTree ? newTree : getVnode(this.ASTtemplate, this)[0]
      let patches = diff(this.nodeTree, newTree)
      this.rootNode = patch(this.rootNode, patches)
      this.nodeTree = newTree
    }
  }
}