import { mergeOption } from '../../src/util/option'
import { LIFECYCLE_HOOK } from '../../src/core/instance/lifecycle'

describe('option data test', () => {
  it('data function merge', () => {
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
    let merge = mergeOption(parent, child)
    let mergeData = merge.data()
    expect(mergeData).toEqual({
      parent: 'parent',
      child: 'child'
    })
  })
})

describe('option method test', () => {
  it('method merge', () => {
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
    let merge = mergeOption(parent, child)
    expect(merge.method.parentMethod()).toEqual('parentMethod')
    expect(merge.method.childMethod()).toEqual('childMethod')
  })
})

describe('option prop test', () => {
  it('prop merge', () => {
    let props1 = {
      prop: ['prop1', 'prop2']
    }
    let props2 = {
      prop: {
        prop: {
          type: String,
          default: 'prop',
          require: true
        }
      }
    }
    let merge1 = mergeOption({}, props1)
    let merge2 = mergeOption({}, props2)
    expect(merge1.prop).toEqual({
      prop1: {
        type: null
      },
      prop2: {
        type: null
      }
    })
    expect(merge2.prop).toEqual({
      prop: {
        type: String,
        default: 'prop',
        require: true
      }
    })
  })
})

describe('option watch test', () => {
  it('watch merge', () => {
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
    let merge = mergeOption(parent, child)
    expect(merge.watch['watchPath.1'][0].handler()).toEqual('watchPath.1')
    expect(merge.watch['watchPath.2'][0].handler()).toEqual('watchPath.2')
    expect(merge.watch['watchPath.3'][0].handler()).toEqual('watchPath.3')
    expect(merge.watch['mergeChild'][0].handler()).toEqual('parent')
    expect(merge.watch['mergeChild'][1].handler()).toEqual('child')
  })
})

describe('option computed test', () => {
  it('computed merge', () => {
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
    let merge = mergeOption(parent, child)
    expect(merge.computed.parentComputed1.get()).toEqual('parentComputed')
    expect(merge.computed.parentComputed2.get()).toEqual('get parentComputed2')
    expect(merge.computed.parentComputed2.set()).toEqual('set parentComputed2')
    expect(merge.computed.changeByChild.get()).toEqual('child')
    expect(merge.computed.childComputed.get()).toEqual('get childComputed')
    expect(merge.computed.childComputed.set()).toEqual('set childComputed')
  })
})

describe('option inject test', () => {
  it('inject merge', () => {
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
    let inject1 = mergeOption({}, injectTest1)
    let inject2 = mergeOption({}, injectTest2)
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

describe('option lifecycle test', () => {
  it('lifecycle merge', () => {
    let parentBC = false
    let parentC = false
    let parentBD = false
    let parentD = false
    let childBC = false
    let childC = false
    let childBD = false
    let childD = false
    let parent = {
      beforeCreate() {
        parentBC = true
      },
      created() {
        parentC = true
      },
      beforeDestroy() {
        parentBD = true
      },
      destroyed() {
        parentD = true
      }
    }
    let child = {
      beforeCreate() {
        childBC = true
      },
      created() {
        childC = true
      },
      beforeDestroy() {
        childBD = true
      },
      destroyed() {
        childD = true
      }
    }
    let merge = mergeOption(parent, child)
    LIFECYCLE_HOOK.forEach(name => {
      merge[name].forEach(fnc => fnc())
    })
    expect(parentBC).toEqual(true)
    expect(parentC).toEqual(true)
    expect(parentBD).toEqual(true)
    expect(parentD).toEqual(true)
    expect(childBC).toEqual(true)
    expect(childC).toEqual(true)
    expect(childBD).toEqual(true)
    expect(childD).toEqual(true)
  })
})

describe('option mixin test', () => {
  it('mixin test', () => {
    let lifecycle = 0
    let mixin = {
      created() {
        lifecycle++
      },
      data() {
        return {
          mixinParent: true,
          mixinChild: false
        }
      },
      method: {
        mixinMethod() {
          return true
        },
        mergeByChild() {
          return false
        },
        coverParent() {
          return true
        }
      }
    }
    let parent = {
      created() {
        lifecycle++
      },
      data() {
        return {
          mixinParent: false
        }
      },
      method: {
        coverParent() {
          return false
        },
        parentMethod() {
          return true
        }
      }
    }
    let child = {
      created() {
        lifecycle++
      },
      mixin: [mixin],
      data() {
        return {
          mixinChild: true
        }
      },
      method: {
        mergeByChild() {
          return true
        },
        childMethod() {
          return true
        }
      }
    }
    let merge = mergeOption(parent, child)
    expect(merge.data()).toEqual({
      mixinParent: true,
      mixinChild: true
    })
    merge['created'].forEach(fnc => fnc())
    expect(merge.method.parentMethod()).toEqual(true)
    expect(merge.method.coverParent()).toEqual(true)
    expect(merge.method.mixinMethod()).toEqual(true)
    expect(merge.method.mergeByChild()).toEqual(true)
    expect(merge.method.childMethod()).toEqual(true)
    expect(lifecycle).toEqual(3)

  })
})
