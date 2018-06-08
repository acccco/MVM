import RD from '../../src/index'
import {h} from '../virtual-dom'

/** @jsx h */

let HelloWorld = new RD({
  render() {
    return <div>
      <p>hello {this.msg}</p>
      <p>my name is {this.fullName}</p>
      <button onclick={this.handle}>Click me</button>
    </div>
  },
  data() {
    return {
      msg: 'world',
      firstName: 'aco',
      lastName: 'yang'
    }
  },
  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`
    }
  },
  method: {
    handle() {
      alert('Oh You Click Me !')
    }
  }
})

export {
  HelloWorld
}