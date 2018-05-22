import RD from '../../src/index'
import vNode from '../vNode/index'

var template = `<p :class="{on:flag,off:!flag}">{{test + test2}}</p>`

RD.use(vNode, RD)

window.rd = new RD({
    data() {
        return {
            test: 'test',
            flag: true
        }
    }
})

rd.$mount(document.getElementById('app'), template)