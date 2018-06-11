import {create, diff, patch} from 'virtual-dom'
import createElement from './createElement'

export default {
  install(RD) {
    RD.prototype.render = function (prop = {}) {
      this.initProp(prop)
      let old = createElement.componentParent
      createElement.componentParent = this
      let nodeTree = this.$options.render.call(this)
      createElement.componentParent = old
      return nodeTree
    }

    RD.prototype.$mount = function (el) {
      let nodeTree = null
      this.$watch(() => {
        nodeTree = this.render.call(this, this.propData)
      }, () => {
        console.log('watch call')
        this.$patch()
      }, {
        ignoreChange: true
      })
      this.nodeTree = nodeTree
      this.rootNode = create(this.nodeTree)
      el.appendChild(this.rootNode)
    }

    RD.prototype.$patch = function () {
      let newTree = this.render.call(this)
      let patches = diff(this.nodeTree, newTree)
      this.rootNode = patch(this.rootNode, patches)
      this.nodeTree = newTree
    }

    RD.prototype.$createNodeTree = function (prop) {
      this.nodeTree = this.render.call(this, prop)
      return this.nodeTree
    }
  }
}