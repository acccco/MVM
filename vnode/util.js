export let pathRe = /^[\w.]+$/
export let runCodeRe = /{{([\s\S]*)}}/g
export let bindPropRe = /(v-bind)?:(\S+)/

export function formatJson(json) {
    return json.replace(/\s*(['"])?\s*([a-zA-Z0-9]+)\s*(['"])?\s*:\s*(['"])?\s*([^\s{},]+)\s*(['"])?\s*/g, '"$2":"$5"')
}

export function getCtxParam(path, ctx) {
    return path.split('.').reduce((obj, item) => obj[item], ctx)
}

export function getClassName(attr, ctx) {

    let className = ''

    if ('class' in attr) {
        if (runCodeRe.test(attr['class'])) {
            className += runCode(attr['class'].replace(runCodeRe, '$1'), ctx)
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
                if (runCode(obj[key], ctx)) {
                    className += ` ${key}`
                }
            }
        }
    }

    return className
}

export function getProperties(attr, ctx) {
    let prop = {}

    for (let key in attr) {
        // class 和 style 单独处理
        if (/class/.test(key)) {
            if (!prop.className)
                prop.className = getClassName(attr, ctx)
            continue
        }

        if (!bindPropRe.test(key)) {
            if (runCodeRe.test(attr[key])) {
                prop[key] = runCode(attr[key].replace(runCodeRe, '$1'), ctx)
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