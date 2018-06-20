import {Computed} from '../../toolbox/Computed'
import {Watcher} from '../../toolbox/Watcher'
import {getProvideForInject, proxyObject, is, checkProp, warn, isNil} from '../../util/util'
import {observe} from '../../toolbox/Observe'

/**
 * 使用合并后的 option 初始化实例的状态
 * inject、prop、method、data、computed、watch、provide
 * @param rd
 */
export function initState(rd) {
  let opt = rd.$option
  if (opt.inject) initInject(rd)
  if (opt.prop) initProp(rd)
  if (opt.method) initMethod(rd)
  if (opt.data) initData(rd)
  if (opt.computed) initComputed(rd)
  if (opt.watch) initWatch(rd)
  if (opt.provide) initProvide(rd)
}

function initInject(rd) {
  let inject = rd._inject = {}
  for (let key in rd.$option.inject) {
    inject[key] = getProvideForInject(rd, key, rd.$option.inject[key].default)
  }
  proxyObject(rd, inject)
}

function initProp(rd) {
  let prop = rd._prop = {}
  let propData = rd.$option.propData || {}
  for (let key in rd.$option.prop) {
    let value = propData[key]
    if (!value) {
      value = rd.$option.prop[key].default
    }
    prop[key] = value
  }
  observe(prop)
  proxyObject(rd, prop, (key) => {
    return checkProp(key, 'prop', rd)
  })
}

function initMethod(rd) {
  for (let key in rd.$option.method) {
    if (checkProp(key, 'method', rd)) {
      rd[key] = rd.$option.method[key]
    }
  }
}

function initData(rd) {
  if (!is(Function, rd.$option.data)) {
    warn('data 项必须是一个函数', rd)
    return
  }
  let data = rd._data = rd.$option.data ? rd.$option.data.call(rd) : {}
  if (isNil(data)) {
    warn('data 函数的返回值必须是一个对象', rd)
    return
  }
  observe(data)
  proxyObject(rd, data, (key) => {
    return checkProp(key, 'data', rd)
  })
}

function initComputed(rd) {
  let computed = rd._computed = {}
  for (let key in rd.$option.computed) {
    computed[key] = (new Computed(rd, key, rd.$option.computed[key])).value
  }
  observe(computed)
  proxyObject(rd, computed, (key) => {
    return checkProp(key, 'computed', rd)
  })
}

function initWatch(rd) {
  for (let key in rd.$option.watch) {
    rd.$option.watch[key].forEach(option => {
      rd._watch.push(new Watcher(rd, () => {
        return key.split('.').reduce((obj, name) => obj[name], rd)
      }, option.handler, option))
    })
  }
}

function initProvide(rd) {
  rd._provide = is(Function, rd.$option.provide) ? rd.$option.provide.call(rd) : rd.$option.provide || {}
}