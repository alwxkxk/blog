---
title: HTML、CSS、JS基础
toc: true
abbrlink: 54080
date: 2018-08-25 17:44:49
tags:
- HTML
- CSS
- JavaScript
---


&emsp;在阅读本篇文章之前，你已经阅读了：
- [软硬结合-导读](/posts/44755)
- [NodeMCU基础](/posts/31494)
- [demo1跑起来](/posts/64786/)
- [demo2跑起来](/posts/64786/)
- [部署到云服务器](/posts/31687/)
- [计算机网络基础](/posts/37707)
- [NodeMCU与网络调试助手联调](/posts/7602)
- [使用NodeJs实现TCP服务器](/posts/58215)

## 本篇视频
<iframe src="//player.bilibili.com/player.html?aid=462062924&bvid=BV16L411n7Pi&cid=379908862&page=9" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

## 本篇学习内容
- 编写最简单的页面
- 自学基本的HTML、CSS、Javascript知识

&emsp;关于HTML、CSS、JavaScript，网上有很多也很优秀的教程，我不再重复。别人写的教程会比我写的完整详细，我这里简单地起一个头。

![不再重复造轮子](/blog/blog_images/不再重复造轮子.webp)

&emsp;先放结论：
- HTML用于描述网页内容。
- CSS用于描述网页样式。
- JavaScript用于实现交互行为。


## HTML
&emsp;超文本标记语言（英语：HyperText Markup Language，简称：HTML），HTML是一种基础技术，常与CSS、JavaScript一起被众多网站用于设计令人赏心悦目的网页、网页应用程序以及移动应用程序的用户界面。网页浏览器可以读取HTML文件，并将其渲染成可视化网页。 ——维基百科

&emsp;手机浏览器请求我的网页时，我想显示一个按钮，于是我代码里返回了一个数据：
```html
这是一个按钮
```
&emsp;然而这个傻逼浏览器竟然没读懂我的想法，最终浏览器展示了一行字：

__这是一个按钮__ 

&emsp;浏览器内心：“我鬼知道你是要想显示字，还是要显示按钮呀？”
&emsp;所以，要另外使用一种方法，让浏览器知道，这部分内容要显示成字，还是显示成按钮，这就是HTML的作用：
```html
<button>这是一个按钮</button>
```
&emsp;最终浏览器展示的效果：
<button>这是一个按钮</button>

&emsp;所以，HTML的本质就是告诉浏览器，这里要显示为按钮，那里要显示为文字。


### 在本机写一个最简单的html
&emsp;完整的html，还包括一些东西，`<html>`和`</html>`之间的文本描述网页，`<body>`和`</body>`之间的文本为可视页面内容。

```HTML
<html>
  <head>
  </head>
  <body>
    <p>这是一段文字</p>
    <button>这是一个按钮</button> 
  </body>
</html>
```

&emsp;打开[vscode](https://code.visualstudio.com/)，然后在桌面新建一个文件夹（名字随意，比如叫`example`），然后拖动文件夹到vscode图标上，再创建一个`index.html`文件，里面复制以上代码并保存。点击打开所创建的`index.html`文件，就可以看到你所写的HTML代码。（直接点击打开index.html是浏览器打开，会被渲染成网页。而用编辑器打开，才会显示HTML代码。）

<iframe src="//player.bilibili.com/player.html?bvid=BV1N54y1j7rA&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

## CSS
&emsp;这玩意就是声明网页的内容该如何演示，能通过CSS改变颜色、大小等等。学习CSS如何练习画画，反复练习就可以了，请结合其它教程学习。
```html
<p style="color:red;">这是一段红色文字</p>
```
## JavaScript
&emsp;HTML与CSS都不是编程语言，都像是种声明。HTML告诉浏览器这一个元素是按钮，CSS告诉浏览器这字体要显示红色，而JavaScript就负责所有逻辑判断、动作交互，如：点击这个按钮就会执行怎么样的动作。

```html
<button onclick="alert('你点击了按钮')">测试按钮</button>
```
&emsp;如果之前有学习过编程语言，学习JavaScript就是熟悉其语法罢了，一理通百理通，很快就能上手。但如果这是你学习第一门编程语言，需要时间就比较长，毕竟学习编程是一个过程，需要时间慢慢学习。

## 使用调试工具查看别人的元素
&emsp;网页有个特点，那就是只要网页能显示出来的，大部分你都能拿到！
&emsp;Chorme浏览器的右上角的省略号，点击打开`更多工具->开发者工具`可以打开调试工具（快捷键`Ctrl+Shift+I`，或者直接右键菜单里`检查`），切到`Element`板块查看别人的的HTML、CSS是怎么写的。当你看到别人的网页很漂亮想参考别人的代码怎么写的时候，或者说想拿那张图片，都可以做到。

## 结给其它教程学习
&emsp;上面我只是简单地演示了使用vscode开发网页，里面还有很多需要学习，比较出名的教程有w3school、菜鸟教程、廖雪峰教程。当然，网上的教程还是比较浅，适合快速了解上手，但根基不实。如果你还想要学习得更踏实，就要啃书。

在线教程:
- [学习 Web 开发- MDN](https://developer.mozilla.org/zh-CN/docs/learn)【推荐】MDN是web领域最好的文档，但好像有时访问不了
- [w3school](http://www.w3school.com.cn/html/index.asp)
- [JavaScript-菜鸟教程](http://www.runoob.com/js/js-tutorial.html)
- [JavaScript教程-廖雪峰](https://www.liaoxuefeng.com/wiki/1022910821149312)

相关书籍:
- 《Head First HTML与CSS》 【萌新最好的入门书籍】
- 《JavaScript DOM编程艺术》
- 《JavaScript高级程序设计》

![网页制作入门 推荐书籍](/blog/blog_images/网页制作入门推荐书籍.webp)

API查询工具: 
- [devdocs](https://devdocs.io/javascript/)


## FAQ
1. 为什么我按网上那些在线教程学，好像效果不怎么样？
__答：网上的教程一般般，不讲技术的诞生原因，不讲核心观念，只讲怎么用而已，所以最好能看书。另一方面，编程需要大量动手练习才能提高能力，绝对不是记一些知识点就能马上做出满意的作品。一般来说，至少模仿三到五个网页，所做出来的东西才能看一下，千万不要因为自己翻了一下书，记了一下知识点，做第一个作品效果太差就气馁。成长需要一个过程，去模仿三到五个网页吧。__
2. 怎么模仿网页？
__答：找一些简单的自己喜欢的网页，然后使用 [chrome开发者工具](/posts/52429) 分析别人是怎么做的，然后自己新自做一次。某个地方做不出来，继续分析继续做。遇到没见过的东西就多搜索，觉得超出自己水平的内容先放下。__
3. Javascript到底写不写`;`，声明变量时到底使用`var`还是`let`或`const`？
__答：Javascript到底写不写`;`看个人习惯，写不写都行。 声明变量时尽量使用`let`或`const`，只有考虑兼容性时才会使用`var`，`var`存在一些的陷阱。__

## 附录
- [HTML规范文档](https://www.w3.org/TR/html/)
- [CSS1规范文档-Cascading Style Sheets, level 1](https://www.w3.org/TR/CSS1/)
- [CSS2规范文档-Cascading Style Sheets Level 2 Revision 1 (CSS 2.1) Specification](https://www.w3.org/TR/CSS2/)


