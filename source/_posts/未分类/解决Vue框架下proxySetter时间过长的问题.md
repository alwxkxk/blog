---
title: 解决Vue框架下proxySetter时间过长的问题
toc: true
abbrlink: 31857
date: 2021-10-23 09:40:33
tags:
---

&emsp;最近在对公司项目进行性能优化时，发现Vue框架下的proxySetter函数使用时间过长：

![Vue中proxySetter时间过长](/blog_images/未分类/Vue中proxySetter时间过长问题.webp)

&emsp;这个时间花费也太猛了，竟然花了1点多秒，这个定位起来没有那么直接，因为这部分函数是同Vue框架执行的。不像公司开发人员自己写的函数，我就直接点进去，看他写的代码，瞄几眼就知道是哪几行代码有性能问题（大部分是在长数组里使用循环找东西，这种改用对象一下就解决了），直接上手改。
&emsp;如果对Vue框架数据绑定原理有初步了解的话，可以从图中看到proxy、observe等等关键字可以联想到，就是数据绑定时花费了大量时间。
&emsp;Vue框架采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty() 来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应监听回调。当把一个普通 Javascript 对象传给 Vue 实例来作为它的 data 选项时，Vue 将遍历它的属性，用 Object.defineProperty() 将它们转为 getter/setter。在属性被访问和修改时通知变化。
&emsp;显然，应该就是Vue框架对一个复杂对象进行数据绑定所导致的问题，举个例子：
```js
mounted(){
    this.fooObj = this.foo()
    // fooObj这个对象拥有10000个属性，所以Vue需要给这10000个属性修改其setter，getter
},

methods:{
    foo(){
        // 返回一个复杂对象
        let result = {}
        for(let i=0;i<100000;i++){
            result[`key${i}`] = `value${i}`
        }
        return result
    }
    
}

```

&emsp;解决的办法有两个：1.不要把复杂的对象绑定到Vue实例里。2.让这个对象的所有字段变成`non-configurable`，让Vue不再对其进行绑定操作：
```js
mounted(){
    this.fooObj = this.foo()
    // 这个复杂对象已经non-configurable，所以不会花大量的时间去修改
},

methods:{
    foo(){
        // 返回一个复杂对象
        let result = {}
        for(let i=0;i<100000;i++){
            result[`key${i}`] = `value${i}`
        }
        
        // 对整个对象所有属性进行处理，让Vue无法修改setter，getter
        Object.keys(result).forEach(key => {
          Object.defineProperty(result, key, { configurable: false })
        })
        // 也可以使用Object.freeze()冻结的对象中的现有属性值是不可变的。
        // 用Object.seal()密封的对象可以改变其现有属性值。
        // Object.seal(result)
        return result
    }
    
}
```

&emsp;Vue实例里对复杂对象进行数据绑定，会导致严重的性能问题，除了会在proxySetter花费大量时间，同时由于复杂对象有可能经常变动导致频繁触发以及GC，各个环节都变得很慢。在调试工具里proxySetter往前找找执行了哪些函数，在这些函数里找到那个复杂对象进行处理就可以解决问题了。