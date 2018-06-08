import createElement from '../vNode/createElement'
import RD from '../../src/index'

/** @jsx createElement */

let HelloWorld = RD.extend({
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

export default HelloWorld