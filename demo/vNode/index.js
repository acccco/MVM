import {create, diff, patch} from "../virtual-dom";

export default {
  install(RD) {
    RD.prototype.$mount = function (el) {
      let nodeTree = null
      this.$watch(() => {
        nodeTree = this.$options.render.call(this)
        return nodeTree
      }, (newTree) => {
        console.log(123123123)
        this.$patch(newTree)
      })
      this.nodeTree = nodeTree
      this.rootNode = create(this.nodeTree)
      el.appendChild(this.rootNode)
    }
    RD.prototype.$patch = function (newTree) {
      let patches = diff(this.nodeTree, newTree)
      this.rootNode = patch(this.rootNode, patches)
      this.nodeTree = newTree
    }
    RD.prototype.$getNodeTree = function () {
      let nodeTree = null
      this.$watch(() => {
        nodeTree = this.$options.render.call(this)
      }, () => {
        this.$patch(this.$root.$getNodeTree())
      })
      return nodeTree
    }
  }
}