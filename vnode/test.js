var html = `<div class="base">
    <p src="{{str1}}" href="{{str2}}" 
    placeholder="{{className}}" :class="{test:a}"
    :a="obj" :b="{on:a}" :style="obj" class="on off"></p>
</div>`

var result = parse.parse(html)
console.log(result)

var ctx = {
    a: true,
    b: false,
    str1: 'str1',
    str2: 'str2',
    method() {
        return this.str1 + this.str2
    },
    className: 'a b',
    obj: {
        a: 1,
        b: 2
    }
}

var tree = {
    nodeTree: null,
    rootNode: null
}

function getVnode(ast, ctx) {
    if (ast.length === 0) {
        return []
    }
    let children = []

    ast.forEach(item => {
        if (item.type === 'text') {
            if (item.content.trim()) {
                if (textRe.test(item.content)) {
                    children.push(new VText(getText(ctx, item.content)))
                } else {
                    children.push(new VText(item.content))
                }
            }
        }
        if (item.type === 'tag') {
            getProperties(item.attrs, ctx)
            children.push(new VNode(item.name, {
                className: getClassName(item.attrs, ctx)
            }, getVnode(item.children, ctx)))
        }
    })
    return children
}

tree.nodeTree = getVnode(result, ctx)[0]

tree.rootNode = createElement(tree.nodeTree)

document.body.appendChild(tree.rootNode)

function getProperties(attr, ctx) {
    var prop = {}

    for (var key in attr) {
        // class 和 style 单独处理
        if (/class/.test(key)) {
            if (!prop.className)
                prop.className = getClassName(attr, ctx)
            continue
        }

        if (!bindPropRe.test(key)) {
            if (replaceTextRe.test(attr[key])) {
                prop[key] = getText(attr[key], ctx)
            } else {
                prop[key] = attr[key]
            }
            continue
        }

        var name = key.replace(bindPropRe, '$2')
        if (pathRe.test(attr[key])) {
            prop[name] = getCtxParam(attr[key], ctx)
        }
    }

    console.log(prop)
    return prop
}