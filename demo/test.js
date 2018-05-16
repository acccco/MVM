var obj = null

var mvm = new Mvm({
    data() {
        return {
            flag: true
        }
    },
    method: {
        changeFlag() {
            this.flag = !this.flag
        }
    },
    patch() {
        return {
            klass: this.flag ? 'on' : 'off'
        }
    },
    patchCallback(newValue, oldValue) {
        obj = newValue
    }
})

obj = mvm.patch()