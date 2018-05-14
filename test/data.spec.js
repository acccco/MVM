import MVM from '../src/index'

let mvm = new MVM({
    data() {
        return {
            testNum: 1,
            objTest: {
                param: 'param'
            }
        }
    },
    watch: {
        'testNum'(){

        }
    }
})

describe('base test', function () {

    it(' expect mvm.testNum equal 1 ', () => {
        expect(mvm.testNum).toEqual(1)
    });

    it(' expect mvm.objTest.param equal param ', () => {
        expect(mvm.objTest.param).toEqual('param')
    })

})