var template = `<p :class="{on:cFlag,off:!cFlag}">{{test}}</p>`

RD.use(vnode, RD)

var rd = new RD({
    data() {
        return {
            test: 'test',
            flag: true
        }
    }
})

rd.$mount(document.getElementById('app'), template)