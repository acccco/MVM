import {create, diff, patch} from "../virtual-dom";

export default {
  install(RD) {
    RD.prototype.render = function (prop) {
      let rd = this
      for (let key in rd.$options.prop) {
        let value = prop[key]
        if (!value) {
          value = rd.$options.prop[key].default
        }
        rd[key] = value
      }
      return rd.$options.render.call(rd)
    }

    RD.prototype.$mount = function (el) {
      let nodeTree = this.$options.render.call(this)
      this.$watch(() => {
        nodeTree = this.$options.render.call(this)
        return nodeTree
      }, (newTree) => {
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

    RD.prototype.$getNodeTree = function (prop) {
      let nodeTree = this.render.call(this, prop)
      this.$watch(() => {
        this.$options.render.call(this)
      }, () => {
        console.log(123123)
        this.$root.$patch(this.$root.$options.render.call(this.$root))
      })
      return nodeTree
    }
  }
}