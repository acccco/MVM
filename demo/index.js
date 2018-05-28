import RD from '../src/index'
import vNode from './vNode/index'
import './index.scss'

RD.use(vNode, RD)

var template = `
<div class="wrap-contain">
  <div for="row * col" class="{{getClassName($index)}}" :style="getWrapStyle($index)">
    <div class="child" :style="getChildStyle($index)"></div>
  </div>
</div>
`

window.rd = new RD({
  data() {
    return {
      row: 2,
      col: 2
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
      return `animation-item item-${Math.floor(index / this.col)}-${index % this.col}`
    },
    getWrapStyle(index) {
      let row = Math.floor(index / this.col)
      let col = index % this.col
      return {
        top: `${100 / this.row * row}%`,
        left: `${100 / this.col * col}%`,
        width: `${100 / this.col}%`,
        height: `${100 / this.row}%`
      }
    },
    getChildStyle(index) {
      let row = Math.floor(index / this.col)
      let col = index % this.col
      return {
        top: `${-100 * row}%`,
        left: `${-100 * col}%`,
        width: `${100 * this.col}%`,
        height: `${100 * this.row}%`
      }
    }
  }
})

rd.$mount(document.getElementById('app'), template)