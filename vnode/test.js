var parse = vnode.htmlParse
var VNode = vnode.vDom.VNode
var VText = vnode.vDom.VText
var diff = vnode.vDom.diff
var patch = vnode.vDom.patch
var createElement = vnode.vDom.create

var html = `<div class="base">
    <p v-bind:class="{on:b}" class="base">{{str1}}</p>
    <p v-bind:class="{on:a}" class="base">{{method()}}</p>
</div>`

var result = parse.parse(html)

var ctx = {
    a: true,
    b: false,
    str1: 'str1',
    str2: 'str2',
    method() {
        return this.str1 + this.str2
    }
}

var tree = {
    nodeTree: null,
    rootNode: null
}

var textRe = /{{(\S*)}}/g

function getVnode(ast, ctx) {
    if (ast.length === 0) {
        return []
    }
    let children = []

    ast.forEach(item => {
        if (item.type === 'text') {
            if (item.content.trim()) {
                if (textRe.test(item.content)) {
                    children.push(new VText(getText(item.content, ctx)))
                } else {
                    children.push(new VText(item.content))
                }
            }
        }
        if (item.type === 'tag') {
            children.push(new VNode(item.name, {
                className: getClassName(ctx, item.attrs)
            }, getVnode(item.children, ctx)))
        }
    })
    return children
}

tree.nodeTree = getVnode(result, ctx)[0]

tree.rootNode = createElement(tree.nodeTree)

document.body.appendChild(tree.rootNode)

function change(ctx, ast, render, tree) {
    var newTree = render(ast, ctx)[0]
    var patches = diff(tree.nodeTree, newTree)
    tree.rootNode = patch(tree.rootNode, patches)
    tree.nodeTree = newTree
}

function formatJson(json) {
    return json.replace(/\s*(['"])?\s*([a-zA-Z0-9]+)\s*(['"])?\s*:\s*(['"])?\s*([a-zA-Z0-9]+)\s*(['"])?\s*/g, '"$2":"$5"')
}

function getClassName(ctx, attrs) {

    var className = ''

    if ('class' in attrs) {
        className += attrs['class']
    }
    if ('v-bind:class' in attrs) {
        let obj = JSON.parse(formatJson(attrs['v-bind:class']))
        for (var key in obj) {
            if (getCtxParam(ctx, obj[key])) {
                className += ` ${key}`
            }
        }
    }

    return className
}

function getCtxParam(ctx, path) {
    return path.split('.').reduce((obj, item) => obj[item], ctx)
}

function getText(str, ctx) {
    return (new Function('return "' + str.replace(textRe, '"+this.$1+"') + '"').call(ctx))
}