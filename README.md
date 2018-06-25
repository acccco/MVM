### Reactive Data 响应式数据

---

让一份数据活起来 ~~

在 `Vue` 中，最让人心动的就是数据的触发方式，不同于 `React` 的 `setState` ，我们在 `Vue` 中需要做的仅仅就是通过修改数据就能得到视图的变换。

在深入了解 `Vue` 源码后，将 `Vue` 中响应式数据的实现给剥离出来便产生了 `RD` 。

### RD 拥有什么？

#### 实例下有什么

从一个简单的例子开始

```
let demo = new RD({
    data(){
        return {
            text: 'Hello',
            firstName: 'aco',
            lastName: 'yang'
        }
    },
    watch:{
        'text'(newValue, oldValue){
            console.log(newValue)
            console.log(oldValue)
        }
    },
    computed:{
        fullName(){
            return this.firstName + ' ' + this.lastName
        }
    },
    method:{
        testMethod(){
            console.log('test')
        }
    }
})

demo.text = 'Hello World'
// console: Hello World
// console: Hello
demo.fullName
// console: aco yang
demo.testMethod()
// console: test
```

嗯，没错，这就是 `Vue` 的写法。在 `Vue` 中，对于涉及到当前组件的状态的一些内容：

1. data
2. computed
3. watch
4. method

以及组件的生命周期：

1. beforeCreate
2. created
3. beforeDestroy
4. destroyed

在 `RD` 中有着同样的效果。

关于组件的生命周期，由于 `RD` 仅仅是维护数据，通知数据变化，而不在意数据变化后的处理，所以生命周期也就只剩下了创建和销毁两个阶段。对于其他的生命周期，可以使用事件手动触发。

关于事件：`RD` 继承了[事件](https://github.com/acccco/RD/blob/master/src/toolbox/Event.js)的类，拥有该类下所有的方法。

1. $on
2. $once
3. $off
4. $emit

在 `Vue` 下并不是通过类继承这种写法实现的，可能是因为不需要引入特别的库去兼容 `ES6` 的类写法吧。但是这几个方法的调用和 `Vue` 是一样的。

当然，如果在实例创建时，将父实例的信息传入，以下两个组件间的数据提供也是有效的

1. prop
2. inject/provied

```
let parent = new RD({
    data(){
        return {
            name: 'parent'
        }
    },
    provied(){
        return {
            foo: 'bar'
        }
    }
})
let child = new RD({
    parent: parent,
    data(){
        return {
            name: 'child'
        }
    },
    inject: {
        foo:{
            default: 'foo'
        }
    }
})
child.$parent.name
// console: parent
child.foo
// console: bar
```

**注1**：实例生成后，所有的配置信息会保存在 `$option` 中，方便使用。

**注2**：关于 `prop` ：由于 `prop` 是动态的，当父组件中 `prop` 的相关值发生变化时，需要手动调用实例下提供的方法：`$initProp` 来通知子组件的变化，而 `prop` 的相关内容由于是在组件组成时动态传递的，所以可以看看 `demo` 。

**注3**：对于所有的复数形式，比如说 `method/prop` 之类的，全部不用复数形式，也就是说全部都不加 `s` ，方便记忆。

#### 类下有什么

在 `RD` 类下提供了 `3` 个方法，分别是：

1. extend 在现有逻辑下扩展实例
2. mixin  用于全局混入
3. use    实现插件系统，自定义的扩展实例

以上方法以及字段的使用与 Vue 一致，[Vue 官网](https://cn.vuejs.org/)

### RD 没有什么

对比 `Vue`， `RD` 仅仅实现了一部分 ，也就是说视图层的渲染逻辑是缺少的，仅仅提供了一种数据的绑定方式，至于这份响应式的数据最终得出来的结果，`RD` 是不关心的。

### DEMO

说的再多也没用，上个例子，一个简单的 `TodoList`。界面接不过多介绍了，主要说说如何实现一个简单的 `MVVM` 框架

在项目目录下运行 `npm run start:demo` 即可查看。

说说实现思路，`RD` + `JSX` + `VNode` = `MVVM`

`VNode` 使用了 `github` 上的一个库，[点击查看](https://github.com/Matt-Esch/virtual-dom)

- `RD` 担当了数据提供和通知数据变化的角色
- `JSX` 承担了模板的作用，主要用于生成 `VNode` 结构
- 通过 `VNode` 的 `create/diff/patch` 通知浏览器 生成/更改 页面结构

大致的编写流程如下：

1. 编写 `JSX` 插件（`demo/jsxPlugin/index.js`），使用 `RD.use` 扩展实例，实现了 `$mount/$createElement/$createComponentVNode/$patch/$initDOMBind` 这些方法
2. 编写获取 `VNode` 树（`demo/jsxPlugin/getTree.js`），根据 `JSX` 生成的结构生成 `VNode` 树结构
3. 编写组件（`demo/component/*.js`）
4. 聚合到 `demo/index.js` 中
5. 一个简单的 `MVVM` 框架实现

插件扩展方法的作用如下：

- $mount：将实例挂载到摸个 `DOM` 元素下，同时监听 `render` （也就是生成 `VNode` 树）所使用的数据，当相关数据变化时，触发 `$patch` 方法
- $createElement：`JSX` 模板编译后使用的方法
- $createComponentVNode：用于创建组件对应的 `VNode` 树，同时监听生成树结构所用到的数据，当数据变动时，触发 `$patch` 方法
- $patch：根据传入的新模板，对比老模板（`getTree.js`）进行 `diff & patch`
- $initDOMBind：绑定每个组件的 `$el`，用于子组件的 `diff & patch`

so 有了 `RD` 手撸一个 `MVVM` 不是梦~~