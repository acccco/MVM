import RD from '../src/index'
import './index.scss'
import {h} from 'virtual-dom'
import vNode from './vNode/'

RD.use(vNode, RD)

/** @jsx h */

window.rd = new RD({
  render() {
    return <div onclick={this.test} style={{color: '#ff9'}}>{this.row}</div>
  },
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
    },
    test() {
      console.log(this.row)
    }
  }
})

rd.$mount(document.getElementById('app'))