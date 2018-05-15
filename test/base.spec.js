import MVM from '../src/index'

let watchTestValue

let mvm = new MVM({
    data() {
        return {
            testNum: 1,
            watcherNum: 1,
            objTest: {
                param: 'param'
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
    },
    watch: {
        'watcherNum'(newValue) {
            watchTestValue = newValue
        }
    }
})

describe('base test', function () {

    it(' expect mvm.testNum equal 1 ', () => {
        expect(mvm.testNum).toEqual(1)
    })

    it(' expect mvm.objTest.param equal param ', () => {
        expect(mvm.objTest.param).toEqual('param')
    })

    it(' expect mvm.doubleNum equal 2 ', () => {
        expect(mvm.doubleNum).toEqual(2)
    })

    it(' expect watchTestValue equal 2 ', () => {
        mvm.watcherNum = 2
        expect(watchTestValue).toEqual(2)
    })

    it(' expect methodTest() equal methodTest ', () => {
        expect(mvm.methodTest()).toEqual('methodTest')
    })

})