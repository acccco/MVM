import {Computed} from '../../toolbox/Computed'
import {Watcher} from '../../toolbox/Watcher'
import {getProvideForInject, proxyObject, is, checkProp} from '../../util/util'
import {observe} from '../../toolbox/Observe'

export function initState(rd) {
  let opt = rd.$option

  rd._prop = {}
  rd._data = {}
  rd._provide = {}

  if (opt.inject) initInject(rd)
  if (opt.prop) initProp(rd)
  if (opt.method) initMethod(rd)
  if (opt.data) initData(rd)
  if (opt.computed) initComputed(rd)
  if (opt.watch) initWatch(rd)
  if (opt.provide) initProvide(rd)
}

function initInject(rd) {
  let inject = rd._inject
  for (let key in  rd.$option.inject) {
    inject[key] = getProvideForInject(rd, key, rd.$option.inject[key].default)
  }
  proxyObject(rd, inject)
}

function initProp(rd) {
  let prop = rd._prop
  let propData = rd.$option.propData
  for (let key in rd.$option.prop) {
    let value = propData[key]
    if (!value) {
      value = rd.$option.prop[key].default
    }
    prop[key] = value
  }
  // 父组件已经监控变化，这里不需要
  // observe(prop)
  proxyObject(rd, prop, (key) => {
    return checkProp(key, 'prop', rd)
  })
}

function initMethod(rd) {
  for (let key in rd.$option.method) {
    if (checkProp(key, 'method', rd)) {
      rd[key] = rd.$option.method[key]
      break
    }
  }
}

function initData(rd) {
  // TODO 必须是函数判断，返回值必须是对象判断
  let data = rd._data = rd.$option.data ? rd.$option.data.call(rd) : {}
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
      rd._watcher.push(new Watcher(rd, () => {
        return key.split('.').reduce((obj, name) => obj[name], rd)
      }, option.handler, option))
    })
  }
}

function initProvide(rd) {
  rd._provide = is(Function, rd.$option.provide) ? rd.$option.provide.call(rd) : rd.$option.provide
}