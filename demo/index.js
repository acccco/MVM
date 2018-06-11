import createElement from './vNode/createElement'
import RD from '../src/index'
import vNode from './vNode/'
import HelloWorld from './component/HelloWorle'
import PropTest from './component/PropTest'
import './index.scss'

RD.use(vNode, RD)

/** @jsx createElement */

let rd = window.rd = new RD({
  render() {
    console.log('index render')
    return <div>
      {this.text}
      <p style={{color: '#ff00ff'}}>{this.fullname}</p>
      <PropTest key='pt' propText={this.propText} propObject={this.propObject}></PropTest>
      <input type="text" value={this.inputValue} oninput={(e) => {
        this.inputValue = e.target.value
      }}/>
    </div>
  },
  data() {
    return {
      text: 'this is ReactiveData demo',
      computedTest: {
        name: 'hello'
      },
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
  computed: {
    fullname() {
      return this.computedTest.name + ' world'
    }
  },
  method: {
    handle() {
      alert('Oh You Click Me !')
    }
  }
})

rd.$mount(document.getElementById('app'))