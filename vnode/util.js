var parse = vnode.htmlParse
var VNode = vnode.vDom.VNode
var VText = vnode.vDom.VText
var diff = vnode.vDom.diff
var patch = vnode.vDom.patch
var createElement = vnode.vDom.create

var pathRe = /^[\w.]+$/
var replaceTextRe = /{{([^\s{}]*)}}/g
var bindPropRe = /(v-bind)?:(\S+)/

function formatJson(json) {
    return json.replace(/\s*(['"])?\s*([a-zA-Z0-9]+)\s*(['"])?\s*:\s*(['"])?\s*([a-zA-Z0-9]+)\s*(['"])?\s*/g, '"$2":"$5"')
}

function getCtxParam(path, ctx) {
    return path.split('.').reduce((obj, item) => obj[item], ctx)
}

function getClassName(attr, ctx) {

    var className = ''

    if ('class' in attr) {
        className += attr['class']
    }
    var classAttr = ''
    if ('v-bind:class' in attr) {
        classAttr = 'v-bind:class'
    }
    if (':class' in attr) {
        classAttr = ':class'
    }
    if (classAttr) {
        var classValue = attr[classAttr]
        if (pathRe.test(classValue)) {
            className += ` ${getCtxParam(classValue, ctx)}`
        } else {
            let obj = JSON.parse(formatJson(attr[classAttr]))
            for (var key in obj) {
                if (getCtxParam(obj[key], ctx)) {
                    className += ` ${key}`
                }
            }
        }
    }

    return className
}


function getText(str, ctx) {
    return (new Function('return "' + str.replace(replaceTextRe, '"+this.$1+"') + '"').call(ctx))
}

function change(ctx, ast, render, tree) {
    var newTree = render(ast, ctx)[0]
    var patches = diff(tree.nodeTree, newTree)
    tree.rootNode = patch(tree.rootNode, patches)
    tree.nodeTree = newTree
}