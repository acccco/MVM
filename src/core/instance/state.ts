import {RD} from "../"
import {Watcher} from '../../class/Watcher'
import {getProvideForInject, checkProp, proxyObject, warn, is} from '../../util/util'
import {observe, observeComputed} from '../../class/Observe'

/**
 * 使用合并后的 option 初始化实例的状态
 * inject、prop、method、data、computed、watch、provide
 * @param rd
 */
export function initState(rd: RD) {
  let opt = rd.$option
  if (opt.inject) initInject(rd)
  if (opt.prop) initProp(rd)
  if (opt.data) initData(rd)
  if (opt.computed) initComputed(rd)
  if (opt.provide) initProvide(rd)
  if (opt.method) initMethod(rd)
  if (opt.watch) initWatch(rd)
}

/**
 * 初始化 inject 并将 inject 代理到 this 对象下
 * @param {RD} rd
 */
function initInject(rd: RD) {
  for (let key in rd.$option.inject) {
    rd._inject[key] = getProvideForInject(rd, key, rd.$option.inject[key].default)
  }
  proxyObject(rd, rd._inject)
}

/**
 * 初始化 prop 并将 prop 代理到 this 对象下
 * @param {RD} rd
 */
function initProp(rd: RD) {
  let propData = rd.$option.propData || {}
  for (let key in rd.$option.prop) {
    let value = propData[key]
    if (!value) {
      value = rd.$option.prop[key].default
    }
    rd._prop[key] = value
  }
  observe(rd._prop)
  proxyObject(rd, rd._prop, (key) => checkProp(key, 'prop', rd))
}

/**
 * 初始化 data 并将 data 代理到 this 对象下
 * @param {RD} rd
 */
function initData(rd: RD) {
  if (!is(Function, rd.$option.data)) {
    warn('data 项必须是一个函数', rd)
    return
  }
  rd._data = rd.$option.data ? rd.$option.data.call(rd) : {}
  if (!is(Object, rd._data)) {
    warn('data 函数的返回值必须是一个对象', rd)
    return
  }
  observe(rd._data)
  proxyObject(rd, rd._data, (key) => checkProp(key, 'data', rd))
}

/**
 * 初始化 computed 并将 computed 代理到 this 对象下
 * @param {RD} rd
 */
function initComputed(rd: RD) {
  for (let key in rd.$option.computed) {
    rd._computed[key] = {}
    rd._computed[key].set = rd.$option.computed[key].set.bind(rd)
    rd._computed[key].get = rd.$option.computed[key].get.bind(rd)
  }
  observeComputed(rd._computed)
  proxyObject(rd, rd._computed, (key) => checkProp(key, 'computed', rd))
}

/**
 * 初始化 method 并将 method 代理到 this 对象下
 * @param {RD} rd
 */
function initMethod(rd: RD) {
  for (let key in rd.$option.method) {
    if (checkProp(key, 'method', rd)) {
      rd[key] = rd.$option.method[key]
    }
  }
}

/**
 * 初始化 watcher
 * @param {RD} rd
 */
function initWatch(rd: RD) {
  for (let key in rd.$option.watch) {
    rd.$option.watch[key].forEach(item => {
      rd._watch.push(new Watcher(rd, () => {
        return key.split('.').reduce((obj, name) => obj[name], rd)
      }, item.callback, item.option))
    })
  }
}

/**
 * 初始化 provide
 * @param {RD} rd
 */
function initProvide(rd: RD) {
  rd._provide = rd.$option.provide ? rd.$option.provide.call(rd) : {}
}
