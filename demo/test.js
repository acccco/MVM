var template = `<p :class="{on:cFlag,off:!cFlag}">{{testNum}}</p>`

RD.use(vnode, RD)

var rd = new RD({
    data() {
        return {
            testNum: 1,
            watcherNum: 1,
            cFlag: false,
            objTest: {
                param: 'param',
                watcherValue1: 'aco',
                watcherValue2: 'aco'
            }
        }
    },
    computed: {
        doubleNum() {
            return this.testNum * 2
        }
    },
    method: {
        methodTest() {
            return 'methodTest'
        }
    }
})

rd.$mount(document.getElementById('app'), template)