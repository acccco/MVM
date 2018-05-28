import {runCode} from "./outStrictMode"

export let pathRe = /^[\w.]+$/
export let runCodeRe = /{{([\s\S]*)}}/g
export let bindPropRe = /(v-bind)?:(\S+)/

export function formatJson(json) {
  return json.replace(/\s*(['"])?\s*([a-zA-Z0-9-]+)\s*(['"])?\s*:\s*(['"])?\s*([^{},]+)\s*(['"])?\s*/g, '"$2":"$5"')
}

export function getCtxParam(path, ctx) {
  return path.split('.').reduce((obj, item) => obj[item], ctx)
}

export function getClassName(attr, ctx, $index) {

  let className = ''

  if ('class' in attr) {
    if (runCodeRe.test(attr['class'])) {
      className += runCode(attr['class'].replace(runCodeRe, '$1'), ctx, $index)
    } else {
      className += attr['class']
    }
  }

  let classAttr = ''
  if ('v-bind:class' in attr) {
    classAttr = 'v-bind:class'
  }
  if (':class' in attr) {
    classAttr = ':class'
  }

  if (classAttr) {
    let classValue = attr[classAttr]
    if (pathRe.test(classValue)) {
      className += ` ${getCtxParam(classValue, ctx)}`
    } else {
      let obj = JSON.parse(formatJson(attr[classAttr]))
      for (let key in obj) {
        if (runCode(obj[key], ctx, $index)) {
          className += ` ${key}`
        }
      }
    }
  }

  return className
}

export function getStyle(attr, ctx, $index) {
  return runCode(attr[':style'], ctx, $index)
}

export function getProperties(attr, ctx, $index) {
  let prop = {}

  for (let key in attr) {
    // 处理 class
    if (/class/.test(key)) {
      if (!prop.className)
        prop.className = getClassName(attr, ctx, $index)
      continue
    }
    // 处理 style
    if (/style/.test(key)) {
      prop.style = getStyle(attr, ctx, $index)
      continue
    }

    if (!bindPropRe.test(key)) {
      if (runCodeRe.test(attr[key])) {
        prop[key] = runCode(attr[key].replace(runCodeRe, '$1'), ctx, $index)
      } else {
        prop[key] = attr[key]
      }
      continue
    }

    let name = key.replace(bindPropRe, '$2')
    if (pathRe.test(attr[key])) {
      prop[name] = getCtxParam(attr[key], ctx)
    }
  }

  return prop
}