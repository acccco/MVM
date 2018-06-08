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

    RD.prototype.$mount = function (el, prop) {
      let nodeTree = null
      this.$watch(() => {
        nodeTree = this.render.call(this, prop)
      }, () => {
        this.$patch()
      }, {
        ignoreChange: true
      })
      this.nodeTree = nodeTree
      console.log(nodeTree)
      this.rootNode = create(this.nodeTree)
      el.appendChild(this.rootNode)
    }

    RD.prototype.$patch = function () {
      let newTree = this.$options.render.call(this)
      let patches = diff(this.nodeTree, newTree)
      this.rootNode = patch(this.rootNode, patches)
      this.nodeTree = newTree
    }

    RD.prototype.$initWatch = function () {
      this.$watch(() => {
        this.render.call(this)
      }, () => {
        this.$root.$patch()
      }, {
        ignoreChange: true
      })
    }

    RD.prototype.$getNodeTree = function (prop) {
      return this.render.call(this, prop)
    }
  }
}