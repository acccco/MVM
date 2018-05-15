import MVM from '../src/index'

let watchTestNum
let watchTestValue1
let watchTestValue2

let mvm = new MVM({
    data() {
        return {
            testNum: 1,
            watcherNum: 1,
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
    },
    watch: {
        'watcherNum'(newValue) {
            watchTestNum = newValue
        },
        'objTest.watcherValue1'(newValue) {
            watchTestValue1 = newValue
        },
        'objTest': {
            handler(newValue) {
                watchTestValue2 = 'deepChange'
            },
            deep: true
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

    it(' expect watchTestNum equal 2 ', () => {
        mvm.watcherNum = 2
        expect(watchTestNum).toEqual(2)
    })

    it(' expect watchTestValue1 equal 2 ', () => {
        mvm.objTest.watcherValue1 = 'acccco'
        expect(watchTestValue1).toEqual('acccco')
    })

    it(' expect watchTestValue2 equal deepChange ', () => {
        mvm.objTest.watcherValue2 = 'acccco'
        expect(watchTestValue2).toEqual('deepChange')
    })

    it(' expect methodTest() equal methodTest ', () => {
        expect(mvm.methodTest()).toEqual('methodTest')
    })

})