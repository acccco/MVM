import {create, diff, patch} from "virtual-dom";

export default {
  install(RD) {
    RD.prototype.$mount = function (el) {
      this.$watch(() => {
        return this.$options.render.call(this)
      }, (newTree) => {
        this.$patch(newTree)
      })
      this.nodeTree = this.$options.render.call(this)
      this.rootNode = create(this.nodeTree)
      el.appendChild(this.rootNode)
    }
    RD.prototype.$patch = function (newTree) {
      let patches = diff(this.nodeTree, newTree)
      this.rootNode = patch(this.rootNode, patches)
      this.nodeTree = newTree
    }
  }
}