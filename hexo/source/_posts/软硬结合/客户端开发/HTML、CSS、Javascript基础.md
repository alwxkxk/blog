---
title: HTML、CSS、JS基础
toc: true
abbrlink: 54080
date: 2018-08-25 17:44:49
tags:
---


&emsp;我使用的编辑器是[vscode](https://code.visualstudio.com/)(主流的轻量级编辑器)，市场主流浏览器[chrome](https://www.google.cn/intl/zh-CN/chrome/)，教程会一直用这两者。关于HTML、CSS、JavaScript，网上有很多也很优秀的教程，我不再重复。在这篇教程里，我只会简单地补充介绍一下HTML、CSS、JavaScript的作用，补充一下网上教程没有涉及到的东西。别人写的教程会比我写的完整详细，我补充一些观念，务必结合多个教程来学习。（只依赖我这个教程是不行的！）

# HTML
&emsp;超文本标记语言(HyperText Markup Language),用于创建网页的标准标记语言。网页浏览器可以读取HTML文件，并将其渲染成可视化网页。
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


## 在本机写一个最简单的html
&emsp;完整的html，还包括一些东西，`<html>和</html>之间的文本描述网页，<body>和</body>之间的文本为可视页面内容`。

```html
<html>
	<head>
	</head>
	<body>
			<p>这是一段文字</p>
			<button>这是一个按钮</button> 
	</body>
</html>
```
&emsp;打开[vscode](https://code.visualstudio.com/)，然后在桌面新建一个文件夹（名字随意，比如叫`example`），然后拖动文件夹到vscode图标上，再创建一个`index.html`文件，里面复制以上代码并保存。点击打开所创建的`index.html`文件，就可以看到你所写的网页。

<video src="https://test-1251805228.cos.ap-guangzhou.myqcloud.com/%E4%BD%BF%E7%94%A8vscode%E7%BC%96%E5%86%99%E6%9C%80%E7%AE%80%E5%8D%95%E7%9A%84html.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>

# CSS
&emsp;HTML负责确定网页中有哪些内容，CSS确定以何种外观(大小、粗细、颜色、对齐和位置)展现这些元素。CSS可以用于设定页面布局、设定页面元素样式、设定适用于所有网页的全局样式。[css-维基百科](https://zh.wikipedia.org/wiki/%E5%B1%82%E5%8F%A0%E6%A0%B7%E5%BC%8F%E8%A1%A8)
```html
<html>
	<head>
	</head>
	<body>
			<p style="color:red;">这是一段文字（红色）</p>
	</body>
</html>
```
<script async src="//jsrun.net/pAgKp/embed/result/light/"></script>

&emsp;我们接下来看看这代码，五行文字全是红色，现在要把它们全部变成黑色。把所有的`style="color:red;"`改成`style="color:black;"`，要改五个地方。
```html
<!-- 更改前 -->
<html>
	<head>
	</head>
	<body>
			<p style="color:red;">这是一段文字</p>
			<p style="color:red;">这是一段文字</p>
			<p style="color:red;">这是一段文字</p>
			<p style="color:red;">这是一段文字</p>
			<p style="color:red;">这是一段文字</p>
	</body>
</html>
```

```html
<!-- 更改后 -->
<html>
	<head>
	</head>
	<body>
			<p style="color:black;">这是一段文字</p>
			<p style="color:black;">这是一段文字</p>
			<p style="color:black;">这是一段文字</p>
			<p style="color:black;">这是一段文字</p>
			<p style="color:black;">这是一段文字</p>
	</body>
</html>
```

&emsp;如果这样的有一百个，重复性操作一百次，就可以选择猝死了。为了不让程序员猝死，减少重复动作，我们要将其封装成类。封装成类后，改变颜色只需要一个地方：`color:red;`改成`color:black;`，没有重复动作。
```html
<!-- 更改前 -->
<html>
	<head>
	</head>
	<body>
		<style type='text/css'>
			.color{
				color:red;
			}
		</style>
			<p class="color">这是一段文字</p>
			<p class="color">这是一段文字</p>
			<p class="color">这是一段文字</p>
			<p class="color">这是一段文字</p>
			<p class="color">这是一段文字</p>
	</body>
</html>

```
```html
<!-- 更改后 -->
<html>
	<head>
	</head>
	<body>
		<style type='text/css'>
			.color{
				color:black;
			}
		</style>
			<p class="color">这是一段文字</p>
			<p class="color">这是一段文字</p>
			<p class="color">这是一段文字</p>
			<p class="color">这是一段文字</p>
			<p class="color">这是一段文字</p>
	</body>
</html>
```

# JavaScirpt
&emsp;HTML告诉了浏览器，要显示什么内容。CSS告诉了浏览器，这些内容的样式（大小颜色等等）。但还缺了一东西，就是动作，要实现动作就要由JavaScript来决定。现在，给按钮添加一个动作，当点击时，就会弹出提示：
```javascript
<html>
  <head>
  </head>
  <body>        
    <script type="text/javascript">
        function myFunction() {
            alert("你点击了按钮")
        }
    </script>
    <button onclick="myFunction()">这是一个按钮</button> 
  </body>
</html>

```
<script async src="//jsrun.net/iAgKp/embed/result/light/"></script>

# 结给其它教程学习
&emsp;上面我只是简单地补充说明一下这HTML、CSS、JavaScript的作用，里面还有很多需要学习，比较出名的教程有w3school、菜鸟教程、廖雪峰教程。当然，网上的教程还是比较浅，如果你还想要学习得更踏实，就要啃书。大约花费一到两个星期（不同人有不同的学习要求，不同的学习速度，不同的深度所以时间不一样。）
- 在线教程
[w3school](http://www.w3school.com.cn/html/index.asp)
[菜鸟教程](http://www.runoob.com/js/js-tutorial.html)
[廖雪峰教程](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000)
- 相关书籍
《Head First HTML与CSS》
《DOM 编程艺术》
《javascript 高级程序设计》
《XX天网页制作从入门到精通》（事实上学完也只能算个入门）


# 练习
&emsp;这里给几个示范，你们能自己亲手完成就代表HTML、CSS、JavaScript到了入门的阶段。
&emsp;html主要是“一切皆盒子”，CSS主要是“布局”，JS主要是“DOM操作与事件”。
- 一切皆盒子
- css布局
- DOM操作与事件

# 后续学习
- Jquery基础
- chrome开发者工具