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
      row: 7,
      col: 9,
      i: 0,
      j: 0
    }
  },
  created() {
    let rd = this
    setInterval(() => {
      rd.i = Math.floor(Math.random() * rd.row)
      rd.j = Math.floor(Math.random() * rd.col)
    }, 600)
  },
  method: {
    checkPoint(index) {
      return index % this.row === this.i || index % this.col === this.j ? 'default-change' : ''
    },
    getClassName(index) {
      return `animation-item item-${Math.floor(index / this.col)}-${index % this.col} ${this.checkPoint(index)}`
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