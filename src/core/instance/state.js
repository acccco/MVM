import {Computed} from '../../toolbox/Computed'
import {Watcher} from '../../toolbox/Watcher'
import {getProvideForInject, proxyObject, is, checkProp} from '../../util/util'
import {observe} from '../../toolbox/Observe'

export function initState(rd) {
  let opts = rd.$options

  rd._prop = {}
  rd._data = {}
  rd._provide = {}

  if (opts.inject) initInject(rd)
  if (opts.prop) initProp(rd)
  if (opts.method) initMethod(rd)
  if (opts.data) initData(rd)
  if (opts.computed) initComputed(rd)
  if (opts.watch) initWatch(rd)
  if (opts.provide) initProvide(rd)
}

function initInject(rd) {
  let inject = rd._inject
  for (let key in  rd.$options.inject) {
    inject[key] = getProvideForInject(rd, key, rd.$options.inject[key].default)
  }
  proxyObject(rd, inject)
}

function initProp(rd) {
  let prop = rd._prop
  let propData = rd.$options.propData
  for (let key in rd.$options.prop) {
    let value = propData[key]
    if (!value) {
      value = rd.$options.prop[key].default
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
  for (let key in rd.$options.method) {
    if (checkProp(key, 'method', rd)) {
      break
    }
  }
}

function initData(rd) {
  // TODO 必须是函数判断，返回值必须是对象判断
  let data = rd._data = rd.$options.data ? rd.$options.data.call(rd) : {}
  observe(data)
  proxyObject(rd, data, (key) => {
    return checkProp(key, 'data', rd)
  })
}

function initComputed(rd) {
  let computed = rd._computed = {}
  for (let key in rd.$options.computed) {
    computed[key] = (new Computed(rd, key, rd.$options.computed[key])).value
  }
  observe(computed)
  proxyObject(rd, computed, (key) => {
    return checkProp(key, 'computed', rd)
  })
}

function initWatch(rd) {
  for (let key in rd.$options.watch) {
    rd.$options.watch[key].forEach(option => {
      rd._watcher.push(new Watcher(rd, () => {
        return key.split('.').reduce((obj, name) => obj[name], rd)
      }, option.handler, option))
    })
  }
}

function initProvide(rd) {
  rd._provide = is(Function, rd.$options.provide) ? rd.$options.provide.call(rd) : rd.$options.provide
}