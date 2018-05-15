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

describe(' options watcher test ', () => {
    it(' watcher merge ', () => {
        let parent = {
            watch: {
                'watchPath.1'() {
                    return 'watchPath.1'
                },
                'watchPath.2': {
                    handler() {
                        return 'watchPath.2'
                    },
                    deep: true
                },
                'mergeChild'() {
                    return 'parent'
                }
            }
        }
        let child = {
            watch: {
                'mergeChild'() {
                    return 'child'
                },
                'watchPath.3'() {
                    return 'watchPath.3'
                }
            }
        }
        let merge = mergeOptions(parent, child)
        expect(merge.watch['watchPath.1'][0].handler()).toEqual('watchPath.1')
        expect(merge.watch['watchPath.2'][0].handler()).toEqual('watchPath.2')
        expect(merge.watch['watchPath.3'][0].handler()).toEqual('watchPath.3')
        expect(merge.watch['mergeChild'][0].handler()).toEqual('parent')
        expect(merge.watch['mergeChild'][1].handler()).toEqual('child')
    })
})

describe(' options computed test ', () => {
    it(' computed merge ', () => {
        let parent = {
            computed: {
                'parentComputed1'() {
                    return 'parentComputed'
                },
                'parentComputed2': {
                    get() {
                        return 'get parentComputed2'
                    },
                    set() {
                        return 'set parentComputed2'
                    }
                },
                'changeByChild'() {
                    return 'parent'
                }
            }
        }
        let child = {
            computed: {
                'changeByChild'() {
                    return 'child'
                },
                'childComputed': {
                    get() {
                        return 'get childComputed'
                    },
                    set() {
                        return 'set childComputed'
                    }
                }
            }
        }
        let merge = mergeOptions(parent, child)
        expect(merge.computed.parentComputed1.get()).toEqual('parentComputed')
        expect(merge.computed.parentComputed2.get()).toEqual('get parentComputed2')
        expect(merge.computed.parentComputed2.set()).toEqual('set parentComputed2')
        expect(merge.computed.changeByChild.get()).toEqual('child')
        expect(merge.computed.childComputed.get()).toEqual('get childComputed')
        expect(merge.computed.childComputed.set()).toEqual('set childComputed')
    })
})

describe(' options inject test ', () => {
    it(' inject merge ', () => {
        let injectTest1 = {
            inject: ['inject1', 'inject2']
        }
        let injectTest2 = {
            inject: {
                inject1: {
                    from: 'provideName',
                    default: 'tests'
                },
                inject2: {
                    from: 'provideName',
                    default: 'tests'
                }
            }
        }
        let inject1 = mergeOptions({}, injectTest1)
        let inject2 = mergeOptions({}, injectTest2)
        expect(inject1.inject).toEqual({
            inject1: {
                from: 'inject1'
            },
            inject2: {
                from: 'inject2'
            }
        })
        expect(inject2.inject).toEqual({
            inject1: {
                from: 'provideName',
                default: 'tests'
            },
            inject2: {
                from: 'provideName',
                default: 'tests'
            }
        })
    })
})