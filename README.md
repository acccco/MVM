# Reactive Data 响应式数据

## 例子

一个简单的例子

```javascript
let demo = new RD({
    data(){
        return {
            text: 'Hello',
            firstName: 'aco',
            lastName: 'yang'
        }
    },
    watch:{
        text(newValue, oldValue){
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

// 测试 data
console.log(demo.text)
// Hello

// 测试 watch
demo.text = 'Hello World'
// Hello World
// Hello

// 测试计算属性
console.log(demo.fullName)
// aco yang

// 测试方法
demo.testMethod()
// test
```

## 字段说明

#### data

```typescript
type dataType = () => object
```

只能使用函数，返回的对象会被代理到实例对象下，即可直接在实例下访问。

#### watch

```typescript
type handleType = (newValue, oldValue) => void
type watchType = {
  [watchName: string]: {
    handle: handleType
    lazy?: boolean
    deep?: boolean
  } | handleType
}
```

当对应的 `watchName` 值发生变化时，执行回调。
`watchName` 为 `data/prop/computed` 中声明过的键值，可以使用 `aaa.bbb` 来监听 `aaa` 对象下的 `bbb` 属性。

#### computed

```typescript
type computedType = {
  [computedName: string]: {
    set: (value) => void
    get: () => any
  } | (() => any)
}
```

根据相应的数据得出结果，相应 `key` 值会被代理到实例对象下，可直接访问。
当然还可以使用 `set` 在赋值时做一些处理。

#### method

```typescript
type methodType = {
  [methodName: string]: Function
}
```

声明的方法会被代理到实例对象下，可直接访问。

#### 生命周期：

1. beforeCreate
2. created
3. beforeDestroy
4. destroyed

`RD` 仅仅是维护数据，通知数据变化，而不在意数据变化后的处理，所以生命周期也就只有创建和销毁两个阶段。

#### 事件

1. $on      添加事件处理
2. $once    添加仅触发一次的事件
3. $off     撤销事件处理
4. $emit    触发事件

#### inject/provide

当然，如果在实例创建时，将父实例通过 `parent` 传入，使用 `inject/provide` 可以越级传递信息。

```javascript
let parent = new RD({
    data(){
        return {
            name: 'parent'
        }
    },
    provide(){
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

console.log(child.$parent.name)
// parent

console.log(child.foo)
// bar
```

`inject/provide` 可以跨多级传递，`inject` 为数据的使用者，`provide` 为数据的提供者。

#### RD 类的静态方法

1. extend   扩展实例，让扩展出的实例拥有默认的 option
2. mixin    用于全局混入
3. use      实现插件系统，自定义的扩展实例

以上方法以及字段的使用与 `Vue` 一致，[Vue 官网](https://cn.vuejs.org/)

#### 关于 prop

由于 `prop` 是动态的，当父组件中 `prop` 的相关值发生变化时，需要手动调用实例下提供的方法：`$initProp` 来通知子组件的变化，而 `prop` 的相关内容由于是在组件生成时动态传递的，所以可以看看 `demo` 。

## RD 没有什么

对比 `Vue`， `RD` 仅仅实现了数据层 ，也就是说视图层的渲染逻辑是缺少的，仅仅提供了一种数据的绑定方式，至于这份响应式的数据最终得出来的结果，`RD` 是不关心的。

## DEMO

说的不如写的，上个例子，一个简单的 `TodoList`。界面接不过多介绍了，主要说说如何实现一个简单的 `MVVM` 框架

在项目目录下运行 `npm run dev` 即可查看。

实现思路：`RD` + `JSX` + `VNode` = `MVVM`

`VNode` 使用了 `github` 上的一个库，[点击查看](https://github.com/Matt-Esch/virtual-dom)

- `RD`      数据提供和通知数据变化
- `JSX`     模板，用于生成 `VNode` 结构
- `VNode`   通过 `create/diff/patch` 方法通知浏览器 生成/更改 页面结构

大致的编写流程如下：

1. 编写 `JSX` 插件（`demo/plugin/index.js`），使用 `RD.use` 扩展实例，实现了 `$mount/$createElement/$createComponentVNode/$patch/$initDOMBind` 这些方法
2. 编写获取 `VNode` 树（`demo/plugin/createElement.js`），根据 `JSX` 生成的结构生成 `VNode` 树结构
3. 编写组件（`demo/component/*.js`）
4. 聚合到 `demo/index.js` 中
5. 一个 `MVVM` 框架实现

插件扩展方法的作用如下：

- $mount：                 将实例挂载到摸个 `DOM` 元素下，当相关数据变化时，重新生成 `VNode` 同时触发 `$patch` 方法
- $createElement：         `JSX` 模板编译后使用的方法， `render` 通过该方法获取 `VNode`
- $createComponentVNode：  用于创建组件对应的 `VNode` 树，同时监听生成树结构所用到的数据，当数据变动时，触发 `$patch` 方法
- $initRenderWatch：       初始化监听，规定当数据发生变化时，需要执行的函数
- $patch：                 根据 `VNode` 进行 `diff & patch`
- $initDOMBind：           绑定每个组件的 `$el`，用于子组件的 `diff & patch`

so 有了 `RD` 手撸一个 `MVVM` 不是梦~~

最后我们来看下我们一共写了几行代码配合 `RD` 实现了这个 `MVVM` 框架（`plugin` 中的内容）

- createElement.js:      87 行
- index.js:              63 行

这还包括了空行，所以我们写了不到 150 行代码就实现了一个 `MVVM` 的框架。
