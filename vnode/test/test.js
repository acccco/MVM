var html = `
<div class="base">
    <p :title="title">{{title}}</p>
    <p title="{{title}}">{{title}}</p>
    <img src="{{img}}a" alt="{{alt}}">
    <img :src="img" :alt="alt">
    <input type="text" placeholder="{{placeholder}}" value="{{value}}">
    <input type="text" :placeholder="placeholder" :value="value">
    <a href="{{link}}">{{link}}</a>
    <a :href="link">{{link}}</a>
</div>
`

var result = parse.parse(html.trim())
console.log(result)

var ctx = {
    title: 'title',
    alt: 'alt',
    img: './img.gif',
    placeholder: 'placeholder',
    value: 'value',
    link: 'http://www.baidu.com'
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
                if (replaceTextRe.test(item.content)) {
                    children.push(new VText(getText(item.content, ctx)))
                } else {
                    children.push(new VText(item.content))
                }
            }
        }
        if (item.type === 'tag') {
            children.push(new VNode(item.name, getProperties(item.attrs, ctx), getVnode(item.children, ctx)))
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