import {create, diff, patch} from 'virtual-dom'
import createElement from './createElement'
import getTree from './getTree'

export default {
  install(RD) {

    RD.prototype.$createElement = function (tag, properties, ...children) {
      return createElement(this, tag, properties, ...children)
    }

    RD.prototype.render = function (prop = {}) {
      this.initProp(prop)
      return this.$option.render.call(this, this.$createElement.bind(this))
    }

    RD.prototype.$mount = function (el) {
      let template = null
      this.$watch(() => {
        template = this.render.call(this, this.propData)
        return template
      }, (newTemplate) => {
        console.log('root watch')
        this.$patch(newTemplate)
      })
      this.$patch(template)
      el.appendChild(this.$el)
    }

    RD.prototype.$patch = function (newTemplate) {
      let newTree = getTree(newTemplate, this.$vnode)
      if (!this._vnode) {
        this.$el = create(newTree)
      } else {
        this.$el = patch(this.$el, diff(this._vnode, newTree))
      }
      this.$vnode = newTemplate
      this._vnode = newTree
    }

    RD.prototype.$createComponentVNode = function (prop) {
      let template = null
      this.$watch(() => {
        template = this.render.call(this, prop)
        return template
      }, (newTemplate) => {
        console.log('component watch')
        this.$patch(newTemplate)
      })
      return template
    }
  }
}