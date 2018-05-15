import {mergeOptions} from '../src/util/options'

describe(' options data test ', () => {
    it(' data function merge ', () => {
        let parent = {
            data() {
                return {
                    parent: 'parent'
                }
            }
        }
        let child = {
            data() {
                return {
                    child: 'child'
                }
            }
        }
        let merge = mergeOptions(parent, child)
        let mergeData = merge.data()
        expect(mergeData).toEqual({
            parent: 'parent',
            child: 'child'
        })
    })
})

describe(' options method test ', () => {
    it(' method merge ', () => {
        let parent = {
            method: {
                parentMethod() {
                    return 'parentMethod'
                }
            }
        }
        let child = {
            method: {
                childMethod() {
                    return 'childMethod'
                }
            }
        }
        let merge = mergeOptions(parent, child)
        expect(merge.method.parentMethod()).toEqual('parentMethod')
        expect(merge.method.childMethod()).toEqual('childMethod')
    })
})

describe(' options props test ', () => {
    it(' props merge ', () => {
        let props1 = {
            props: ['prop1', 'prop2']
        }
        let props2 = {
            props: {
                prop: {
                    type: String,
                    default: 'prop',
                    require: true
                }
            }
        }
        let merge1 = mergeOptions({}, props1)
        let merge2 = mergeOptions({}, props2)
        expect(merge1.props).toEqual({
            prop1: {
                type: null
            },
            prop2: {
                type: null
            }
        })
        expect(merge2.props).toEqual({
            prop: {
                type: String,
                default: 'prop',
                require: true
            }
        })
    })
})