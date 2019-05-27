import { create, diff, patch } from 'virtual-dom'
import { createElement, resetMap } from './createElement'

export default {
  install(RD) {

    RD.$mount = function (el, rd) {
      if (!rd.$renderWatch) {
        rd.$initRenderWatch()
      }
      el.appendChild(rd.$el)
    }

    RD.prototype.render = function () {
      return this.$option.render.call(this, this.$createElement.bind(this))
    }

    RD.prototype.$createElement = function (tag, properties, ...children) {
      return createElement(this, tag, properties, ...children)
    }

    RD.prototype.$createComponentVNode = function (prop) {
      if (!this.$renderWatch) {
        this.$initRenderWatch()
      }
      this.$initProp(prop)
      return this._vnode
    }

    RD.prototype.$initRenderWatch = function () {
      this.$renderWatch = this.$watch(() => {
        console.log('watch call:', this.id)
        let vnode = this.render()
        vnode.isComponent = true
        vnode.component = this
        return vnode
      }, (vnode) => {
        resetMap(this)
        this.$patch(vnode)
      }, { initCallback: true })
    }

    RD.prototype.$patch = function (vnode) {
      if (!this._vnode) {
        this.$el = create(vnode)
      } else {
        this.$el = patch(this.$el, diff(this._vnode, vnode))
      }
      this._vnode = vnode
      this.$initDOMBind(this.$el, vnode)
    }

    RD.prototype.$initDOMBind = function (rootDom, vnode) {
      if (!vnode.children || vnode.children.length === 0) return
      for (let i = 0, len = vnode.children.length; i < len; i++) {
        if (vnode.children[i].isComponent) {
          vnode.children[i].component.$el = rootDom.childNodes[i]
        }
        this.$initDOMBind(rootDom.childNodes[i], vnode.children[i])
      }
    }
  }
}
