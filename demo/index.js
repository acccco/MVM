import RD from '../src/index'
import {h} from './virtual-dom'
import vNode from './vNode/'
import HelloWorld from './component/HelloWorle'
import PropsTest from './component/PropsTest'
import './index.scss'

RD.use(vNode, RD)

/** @jsx h */

window.rd = new RD({
  render() {
    return <div>
      <p>{this.text}</p>
      <HelloWorld parent={this} key='1'></HelloWorld>
      <PropsTest parent={this} key='1' propText={this.propText} propObject={this.propObject}
                 style={{color: '#ff00ff'}}></PropsTest>
      <input type="text" value={this.inputValue} oninput={(e) => {
        this.inputValue = e.target.value
      }}/>
    </div>
  },
  data() {
    return {
      text: 'this is ReactiveData demo',
      propText: 'this is propText',
      propObject: {
        firstName: 'aco',
        lastName: 'yang'
      },
      inputValue: ''
    }
  },
  watch: {
    'inputValue'(newValue, oldValue) {
      console.log(`inputValue change: ${oldValue} => ${newValue}`)
    }
  },
  method: {
    handle() {
      alert('Oh You Click Me !')
    }
  }
})

rd.$mount(document.getElementById('app'))