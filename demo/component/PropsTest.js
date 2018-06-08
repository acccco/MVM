import RD from '../../src/index'
import {h} from '../virtual-dom'

/** @jsx h */

let HelloWorld = RD.extend({
  render() {
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

export default HelloWorld