import RD from '../src/index'
import vNode from './vNode/index'
import './index.scss'

var template = `
<div class="wrap-contain">
  <div for="63" class="{{getClassName($index)}}" :class="{start-change:num === $index}">
    <div class="child"></div>
  </div>
</div>
`

RD.use(vNode, RD)

window.rd = new RD({
  data() {
    return {
      num: 1
    }
  },
  created() {
    let rd = this
    setInterval(() => {
      rd.num = Math.ceil(Math.random() * 63)
    }, 800)
  },
  method: {
    getClassName(index) {
      return `animation-item item-${Math.ceil(index / 9)}-${(index - 1) % 9 + 1}`
    }
  }
})

rd.$mount(document.getElementById('app'), template)