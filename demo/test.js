var template = `<p :class="{on:cFlag,off:!cFlag}">{{test}}</p>`

Mvm.use(vnode, Mvm)

var mvm = new Mvm({
    data() {
        return {
            test: 'test',
            cFlag: true
        }
    }
})

mvm.$mount(document.getElementById('app'), template)