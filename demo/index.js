import createElement from './vNode/createElement'
import RD from '../src/index'
import vNode from './vNode/'
import PropTest from './component/PropTest'
import HelloWorld from './component/HelloWorld'
import './index.scss'

RD.use(vNode, RD)

/** @jsx createElement */

let rd = window.rd = new RD({
  render() {
    return <div>
      {this.text}
      <p style={{color: '#ff00ff'}}>{this.text}</p>
      <HelloWorld key='hw'></HelloWorld>
      <PropTest key='pt' propText={this.propText} propObject={this.propObject}></PropTest>
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
  }
})

rd.$mount(document.getElementById('app'))