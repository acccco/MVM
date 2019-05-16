import {
  computedOption,
  injectOption,
  optionType,
  propOption, userComputedOption,
  userOptionType,
  userWatchOption,
  watchOption
} from "../types/option"
import {arrayT, commonObject} from "../types/commom"

import {noop, clone, is} from './util'
import {LIFECYCLE_HOOK} from '../core/instance/lifecycle'
import {computedHandle} from "../types/computed"

/**
 * 判断是否是用户自己写的属性
 * @param {string} key
 * @returns {boolean}
 */
function isUserPrams(key: string): boolean {
  let list = [
    ...LIFECYCLE_HOOK,
    'mixin',
    'inject',
    'data',
    'prop',
    'computed',
    'provide',
    'method',
    'watch'
  ]
  return list.indexOf(key) === -1
}

/**
 * 合并两个 option
 * @param {optionType} parent
 * @param {optionType} child
 * @returns {optionType}
 */
export function mergeOption(parent: optionType = {}, child: userOptionType = {}): optionType {
  let fChild = formatChild(child)

  let option = clone(parent)

  if (fChild.mixin) {
    for (let i = 0, l = fChild.mixin.length; i < l; i++) {
      option = mergeOption(option, fChild.mixin[i])
    }
  }

  // 合并 data
  option.data = mergeFunction(option.data, fChild.data)

  // 合并 provide
  option.provide = mergeFunction(option.provide, fChild.provide)

  // 合并 watcher 同名合并成一个数组
  option.watch = mergeWatch(option.watch, fChild.watch)

  // 合并生命周期函数
  LIFECYCLE_HOOK.forEach(name => {
    if (fChild[name]) {
      option[name].push(...fChild[name])
    }
  })

  // 同名覆盖的属性
  let needMerge = ['inject', 'prop', 'computed', 'method']

  needMerge.forEach(name => {
    option[name] = {...option[name], ...fChild[name]}
  })

  // 其他属性以 child 为准
  for (let key in fChild) {
    if (isUserPrams(key)) {
      option[key] = fChild[key]
    }
  }

  return option
}

/**
 * 合并函数
 * @param {() => object} parentValue
 * @param {() => object} childValue
 * @returns {() => object}
 */
function mergeFunction(parentValue: () => object = noop, childValue: () => object = noop): () => object {
  return function mergeFnc() {
    // @ts-ignore
    return {...parentValue.call(this), ...childValue.call(this)}
  }
}

/**
 * 合并 watch 属性
 * @param {watchOption} parentVal
 * @param {watchOption} childVal
 * @returns {watchOption}
 */
function mergeWatch(parentVal: watchOption = {}, childVal: watchOption = {}): watchOption {
  let watch = clone(parentVal)
  for (let key in childVal) {
    if (!watch[key]) {
      watch[key] = []
    }
    watch[key].push(...childVal[key])
  }
  return watch
}

/**
 * 用于格式化用户传入的 option 将格式整理成系统规定的形式
 * @param {userOptionType} option
 * @returns {optionType}
 */
function formatChild(option: userOptionType): optionType {
  let fOption: optionType = {}
  let map: commonObject = {
    inject: normalizeInject,
    prop: normalizeProp,
    computed: normalizeComputed,
    provide: normalizeProvide,
    watch: normalizeWatch
  }

  LIFECYCLE_HOOK.forEach(name => {
    map[name] = normalizeLifecycle
  })

  for (let key in option) {
    if (map[key]) {
      fOption[key] = map[key](option[key])
    } else {
      fOption[key] = option[key]
    }
  }
  return fOption
}

/**
 * 统一处理不同形式的 inject
 * @param {Array<string> | injectOption} inject
 * @returns {injectOption}
 */
function normalizeInject(inject: Array<string> | injectOption): injectOption {
  let normalInject: injectOption = {}
  if (is(Array, inject)) {
    (<any>inject).forEach((key: string) => {
      normalInject[key] = {
        from: key
      }
    })
  } else if (is(Object, inject)) {
    inject = <injectOption>inject
    for (let key in inject) {
      if (!('from' in inject[key])) {
        normalInject[key].from = key
      }
      normalInject[key].default = inject[key].default
    }
  }
  return normalInject
}

/**
 * 统一处理不同形式的 prop
 * prop 的两种形式： Array<string>  Array<propObject>
 * @param {Array<string> | Array<propOption>} prop
 * @returns {propOption}
 */
function normalizeProp(prop: Array<string | propOption>) {
  let normalProps: propOption = {}
  if (is(Array, prop)) {
    (<any>prop).forEach((prop: string) => {
      normalProps[prop] = {
        type: null
      }
    })
  } else if (is(Object, prop)) {
    for (let key in prop) {
      normalProps[key] = {type: null, ...<any>prop[key]}
    }
  }
  return normalProps
}

/**
 * 统一处理不同形式的 computed
 * @param {userComputedOption} computed
 * @returns {computedOption}
 */
function normalizeComputed(computed: userComputedOption): computedOption {
  let normalComputed: computedOption = {}

  for (let key in computed) {
    if (is(Function, computed[key])) {
      normalComputed[key] = {
        get: <Function>computed[key],
        set: noop
      }
    } else {
      normalComputed[key] = <computedHandle>computed[key]
    }
  }
  return normalComputed
}

/**
 * 统一处理不同形式的 computed
 * @param {() => object | object} provide
 * @returns {() => object}
 */
function normalizeProvide(provide: () => object | object): () => object {
  if (is(Object, provide)) {
    return () => provide
  }
  return provide
}

/**
 * 统一处理不同形式的 watcher
 * watcher 的两种形式 Array<>
 * @param {userWatchOption} watch
 * @returns {watchOption}
 */
function normalizeWatch(watch: userWatchOption): watchOption {
  let normalWatch: watchOption = {}

  function format(oneWatch: any) {
    if (is(Object, oneWatch)) {
      return {
        callback: oneWatch.callback,
        option: {
          deep: !!oneWatch.deep,
          lazy: !!oneWatch.lazy
        }
      }
    } else {
      return {
        callback: oneWatch,
        option: {}
      }
    }
  }

  for (let key in watch) {
    if (is(Array, watch[key])) {
      normalWatch[key] = (<[]>watch[key]).map(oneWatch => format(oneWatch))
    } else {
      normalWatch[key] = [format(watch[key])]
    }
  }

  return normalWatch
}

/**
 * 处理生命周期函数
 * @param {Function} lifecycle
 * @returns {Array<Function>}
 */
function normalizeLifecycle(lifecycle: arrayT<Function>): Array<Function> {
  if (is(Function, lifecycle)) {
    return [<Function>lifecycle]
  }
  if (is(Array, lifecycle)) {
    return <Array<Function>>lifecycle
  }
  return []
}
