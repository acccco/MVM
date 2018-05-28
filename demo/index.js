import RD from '../src/index'
import vNode from './vNode/index'
import './index.scss'

var template = `
<div class="wrap-contain">
  <div for="row * col" class="{{getClassName($index)}}">
    <div class="child"></div>
  </div>
</div>
`

RD.use(vNode, RD)

window.rd = new RD({
  data() {
    return {
      row: 7,
      col: 9
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
      console.log(index)
      return `animation-item item-${Math.floor(index / this.col)}-${index % this.col}`
    }
  }
})

rd.$mount(document.getElementById('app'), template)