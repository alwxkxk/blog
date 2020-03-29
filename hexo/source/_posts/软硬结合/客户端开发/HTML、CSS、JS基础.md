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


&emsp;我使用的编辑器是[vscode](https://code.visualstudio.com/)(主流的轻量级编辑器)，市场主流浏览器[chrome](https://www.google.cn/intl/zh-CN/chrome/)，教程会一直用这两者。关于HTML、CSS、JavaScript，网上有很多也很优秀的教程，我不再重复。别人写的教程会比我写的完整详细，我补充一些观念，务必结合多个教程来学习。（只依赖我这个教程是不行的！）

![不再重复造轮子](/blog_images/005BIQVbgy1fxa63z5bylj30ms0bmq5j.jpg)

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
&emsp;完整的html，还包括一些东西，`<html>和</html>之间的文本描述网页，<body>和</body>之间的文本为可视页面内容`。

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

<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com/%E4%BD%BF%E7%94%A8vscode%E7%BC%96%E5%86%99%E6%9C%80%E7%AE%80%E5%8D%95%E7%9A%84html.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>

## CSS
&emsp;这玩意就是声明网页的内容该如何演示，能通过CSS改变颜色、大小等等。学习CSS如何练习画画，反复练习就可以了，请结合其它教程学习。

## JavaScript
&emsp;HTML与CSS都不是编程语言，都像是种声明。HTML告诉浏览器这一个元素是按钮，CSS告诉浏览器这字体要显示红色，而JavaScript就负责所有逻辑判断、动作交互，如：点击这个按钮就会执行怎么样的动作。如果之前有学习过编程语言，学习JavaScript就是熟悉其语法罢了，一理通百理通，很快就能上手。但如果这是你学习第一门编程语言，需要时间就比较长，毕竟学习编程是一个过程，需要时间慢慢学习。请结合其它教程学习。

## API查询工具
- [devdocs](https://devdocs.io/javascript/)

## 结给其它教程学习
&emsp;上面我只是简单地演示了使用vscode开发网页，里面还有很多需要学习，比较出名的教程有w3school、菜鸟教程、廖雪峰教程。当然，网上的教程还是比较浅，适合快速了解上手，但根基不实。如果你还想要学习得更踏实，就要啃书。大约花费 __一到两个星期__ （PS:一天按八小时计算，不同人有不同的学习要求，不同的学习速度，不同的深度所以时间不一样。若之前没有学过其它编程语言，需要更多时间。）
- 在线教程
[w3school](http://www.w3school.com.cn/html/index.asp)
[菜鸟教程](http://www.runoob.com/js/js-tutorial.html)
[廖雪峰教程](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000)
- 相关书籍
《Head First HTML与CSS》
《JavaScript DOM编程艺术》
《JavaScript高级程序设计》
《XX天网页制作从入门到精通》（事实上学完也只能算个入门）

![网页制作入门 推荐书籍](/blog_images/005BIQVbgy1fz2vbiidchj30sd0li7d7.jpg)


## 作业
![](/blog_images/005BIQVbgy1fxqbd2o44uj30gv07qt9o.jpg)
&emsp;先自行学习完那些线上教程与纸质书里的基础知识 __(大约一两个星期)__ 。如果是看纸质书的话，会有作业。如果只看网上教程，没有作业，很容易让大家以为自己轻松撑握了。这里给一个示例，你们能自己亲手完成就代表HTML、CSS、JavaScript到了入门的阶段。简单例子及源代码：[HTML、CSS、JS基础练习.rar](https://test-1251805228.file.myqcloud.com/%E7%A4%BA%E4%BE%8B%E4%BB%A3%E7%A0%81/HTML%E3%80%81CSS%E3%80%81JS%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0.rar)
其中用到了flex布局，网上的基础教程以及旧的书籍可能没有介绍，需要自行百度了解一下。


<img class="lazy" alt="HTML、CSS、JS基础练习" data-src="/blog_images/005BIQVbgy1fvtnt3j13eg31e80qfx6s.gif">

&emsp;大家参考一下源代码，如果说看一眼就知道怎么做的，就说明基础已经过了，可以进行下一节了。如果还有很多不明白的，那就要继续学习。

## FAQ
1. 为什么我按网上那些在线教程学，好像效果不怎么样？
__答：网上的教程一般般，不讲技术的诞生原因，不讲核心观念，只讲怎么用而已，所以最好能看书。另一方面，编程需要大量动手练习才能提高能力，绝对不是记一些知识点就能马上做出满意的作品。一般来说，至少模仿三到五个网页，所做出来的东西才能看一下，千万不要因为自己翻了一下书，记了一下知识点，做第一个作品效果太差就气馁。成长需要一个过程，去模仿三到五个网页吧。__
2. 怎么模仿网页？
__答：找一些简单的自己喜欢的网页，然后使用 [chrome开发者工具](/posts/52429) 分析别人是怎么做的，然后自己新自做一次。某个地方做不出来，继续分析继续做。遇到没见过的东西就多搜索，觉得超出自己水平的内容先放下。__
3. Javascript到底写不写`;`，声明变量时到底使用`var`还是`let`或`const`？
__答：Javascript到底写不写`;`看个人习惯，写不写都行。 声明变量时尽量使用`let`或`const`，只有考虑兼容性时才会使用`var`，`var`存在一些的陷阱。__

## 下一节
- [chrome开发者工具](/posts/52429)
&emsp;__强烈建议先学这个开发者工具，先学会调试自己的代码。__
- [Jquery、Bootstrap基础](/posts/27238)
&emsp;Jquery让JS操作DOM更加简单，Bootstrap提供优秀的样式供你直接使用，短时间内就能让页面变得十分漂亮。
- [nodejs基础](/posts/56793)
&emsp;本地打开网页，你可以注意到网址栏的协议是file，而不是http。要想让手机也能访问网页，就需要提供对外http服务，最终让手机访问网页。

## 附录
- [HTML规范文档](https://www.w3.org/TR/html/)
- [CSS1规范文档-Cascading Style Sheets, level 1](https://www.w3.org/TR/CSS1/)
- [CSS2规范文档-Cascading Style Sheets Level 2 Revision 1 (CSS 2.1) Specification](https://www.w3.org/TR/CSS2/)


