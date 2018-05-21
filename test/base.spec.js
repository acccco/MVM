import RD from '../src/index'

let watchTestNum
let watchTestValue1
let watchTestValue2

let rd = new RD({
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

    it(' expect rd.testNum equal 1 ', () => {
        expect(rd.testNum).toEqual(1)
    })

    it(' expect rd.objTest.param equal param ', () => {
        expect(rd.objTest.param).toEqual('param')
    })

    it(' expect rd.doubleNum equal 2 ', () => {
        expect(rd.doubleNum).toEqual(2)
    })

    it(' expect watchTestNum equal 2 ', () => {
        rd.watcherNum = 2
        expect(watchTestNum).toEqual(2)
    })

    it(' expect watchTestValue1 equal 2 ', () => {
        rd.objTest.watcherValue1 = 'acccco'
        expect(watchTestValue1).toEqual('acccco')
    })

    it(' expect watchTestValue2 equal deepChange ', () => {
        rd.objTest.watcherValue2 = 'acccco'
        expect(watchTestValue2).toEqual('deepChange')
    })

    it(' expect methodTest() equal methodTest ', () => {
        expect(rd.methodTest()).toEqual('methodTest')
    })

})