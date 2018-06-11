import createElement from '../vNode/createElement'
import RD from '../../src/index'
import HelloWorld from './HelloWorle'

/** @jsx createElement */

let PropTest = RD.extend({
  render() {
    console.log('render')
    return <div>
      <p>{this.defaultTest}</p>
      <p>{this.propText}</p>
      <p>{this.fullName}</p>
    </div>
  },
  prop: {
    defaultTest: {
      type: String,
      default: 'prop default Text'
    },
    propText: {
      type: String,
      default: ''
    },
    propObject: {
      type: Object,
      default: {
        firstName: '',
        lastName: ''
      }
    }
  },
  data() {
    return {
      msg: 'world'
    }
  },
  computed: {
    fullName() {
      return `${this.propObject.firstName} ${this.propObject.lastName}`
    }
  }
})

export default PropTest