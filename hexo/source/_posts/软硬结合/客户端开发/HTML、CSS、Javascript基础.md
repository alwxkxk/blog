---
title: HTML、CSS、Javascript基础
toc: true
abbrlink: 54080
date: 2018-08-25 17:44:49
tags:
---


&emsp;我使用的编辑器是[vscode](https://code.visualstudio.com/)(主流的轻量级编辑器)，市场主流浏览器[chrome](https://www.google.cn/intl/zh-CN/chrome/)，教程会一直用这两者。

# HTML
&emsp;超文本标记语言(HyperText Markup Language),用于创建网页的标准标记语言。网页浏览器可以读取HTML文件，并将其渲染成可视化网页。
&emsp;手机浏览器请求我的网页时，我想显示一个按钮，于是我代码里返回了一个数据：
```html
这是一个按钮
```
&emsp;然而这个傻逼浏览器竟然没读懂我的想法，最终浏览器展示了一行字：

__这是一个按钮__ 

&emsp;浏览器内心：“我鬼知道你是要想显示字，还是要显示按钮呀？”
&emsp;所以，要另外使用一种方法，让浏览器知道，我这是想要显示字，还是想要显示按钮，这就是HTML：
```html
<button>这是一个按钮</button>
```
&emsp;最终浏览器展示的效果：
<button>这是一个按钮</button>

&emsp;所以，HTML的本质就是告诉浏览器，这里我要显示为按钮，那里我要显示为标题。


## 在本机写一个最简单的html
&emsp;其实，完整的页面，还包括一些东西，`<html>和</html>之间的文本描述网页，<body>和</body>之间的文本为可视页面内容`。

```html
<html>
    <head>
    </head>
    <body>
        <p>这是一段方字</p>
        <button>这是一个按钮</button> 
    </body>
</html>
```
&emsp;先安装[vscode](https://code.visualstudio.com/)，然后在桌面新建一个文件夹（名字随意，比如叫`example`），然后拖动文件夹到vscode图标上，再创建一个`index.html`文件，里面复制以上代码并保存。点击打开所创建的`index.html`文件，就可以看到你所写的网页。

<video src="https://test-1251805228.cos.ap-guangzhou.myqcloud.com/%E4%BD%BF%E7%94%A8vscode%E7%BC%96%E5%86%99%E6%9C%80%E7%AE%80%E5%8D%95%E7%9A%84html.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>

# CSS
# Javascirpt


# 其它
<script async src="//jsrun.net/KmgKp/embed/html,result/light/"></script>
&emsp;__JSRUN是国内网页在线编辑器,操作示范图：__ 
![](http://ww1.sinaimg.cn/large/005BIQVbgy1fuojmp8nkij30tf06z0sz.jpg)

&emsp;如果你还没学习git，请记得学习它。google是屠龙刀，而git是倚天剑，两者都必须拥有。 git有比较好的教程：[git教程-廖雪峰](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)，我就不再重复。