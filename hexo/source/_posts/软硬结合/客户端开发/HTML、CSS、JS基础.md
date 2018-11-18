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


&emsp;我使用的编辑器是[vscode](https://code.visualstudio.com/)(主流的轻量级编辑器)，市场主流浏览器[chrome](https://www.google.cn/intl/zh-CN/chrome/)，教程会一直用这两者。关于HTML、CSS、JavaScript，网上有很多也很优秀的教程，我不再重复。在这篇教程里，我只会简单地补充介绍一下HTML、CSS、JavaScript的作用，补充一下网上教程没有涉及到的东西。别人写的教程会比我写的完整详细，我补充一些观念，务必结合多个教程来学习。（只依赖我这个教程是不行的！）

![不再重复造轮子](http://ww1.sinaimg.cn/large/005BIQVbgy1fxa63z5bylj30ms0bmq5j.jpg)

&emsp;先放结论：
- HTML用于描述网页内容。
- CSS用于描述网页样式。
- JavaScript用于实现交互行为。


# HTML
>1980年，物理学家蒂姆·伯纳斯-李在欧洲核子研究中心（CERN）在承包工程期间，为使CERN的研究人员使用并共享文档，他提出并创建原型系统ENQUIRE。1989年，伯纳斯-李在一份备忘录中提出一个基于互联网的超文本系统。他规定HTML并在1990年底写出浏览器和服务器软件。自1996年起，HTML规范一直由万维网联盟（W3C）维护，并由商业软件厂商出资。不过在2000年，HTML也成为国际标准（ISO/ IEC15445：2000）。2004年，网页超文本应用技术工作小组（WHATWG）开始开发HTML5，并在2008年与W3C共同交付，2014年10月28日完成标准化。
超文本标记语言（英语：HyperText Markup Language，简称：HTML）是一种用于创建网页的标准标记语言。HTML是一种基础技术，常与CSS、JavaScript一起被众多网站用于设计令人赏心悦目的网页、网页应用程序以及移动应用程序的用户界面。网页浏览器可以读取HTML文件，并将其渲染成可视化网页。HTML描述了一个网站的结构语义随着线索的呈现，使之成为一种标记语言而非编程语言。 ——维基百科

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

<video class="lazy" controls data-src="https://test-1251805228.cos.ap-guangzhou.myqcloud.com/%E4%BD%BF%E7%94%A8vscode%E7%BC%96%E5%86%99%E6%9C%80%E7%AE%80%E5%8D%95%E7%9A%84html.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>


# CSS
>HTML规范虽然规定了网页中的标题、段落应该使用的标签，但是没有涉及这些内容应该以何种样式(比如大小、位置、间距、缩进等属性)呈现在浏览器中。从1990年代初HTML被发明开始，样式表就以各种形式出现了。不同的浏览器结合了它们各自的样式语言，读者(也就是浏览网页的用户)可以使用这些样式语言来调节网页的显示方式。一开始样式表是给读者用的，最初的HTML版本只含有很少的显示属性，读者来决定网页应该怎样被显示。于1994年，哈肯·维姆·莱和伯特·波斯合作设计CSS。他们在1994年首次在芝加哥的一次会议上第一次展示了CSS的建议。
层叠样式表（英语：Cascading Style Sheets，简写CSS），一种用来为结构化文档（如HTML文档或XML应用）添加样式（字体、间距和颜色等）的计算机语言，由W3C定义和维护。——维基百科

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
<p style="color:red;">这是一段文字（红色）</p>

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
>1993年，伊利诺伊大学厄巴纳-香槟分校的国家超级计算机应用中心（NCSA）发表了NCSA Mosaic，这是最早流行的图形接口网页浏览器，它在万维网的普及上发挥了重要作用。1994年，一家名为Mosaic Communications的公司在加州山景城成立了，并雇用了许多原来的NCSA Mosaic开发者用来开发Mosaic Netscape，该公司的目标是取代NCSA Mosaic成为世界第一的网页浏览器。第一个版本的网页浏览器Mosaic Netscape 0.9于1994年底发布。在四个月内，已经占据了四分之三的浏览器市场，并成为1990年代互联网的主要浏览器。为避免NCSA的商标所有权问题，该浏览器于同年更名为Netscape Navigator，该公司命名为Netscape Communications。网景预见到网上需要变得更动态。公司的创始人马克·安德森认为HTML需要一种胶水语言，让网页设计师和兼职程序员可以很容易地使用它来组装图片和插件之类的组件，且代码可以直接编写在网页标记中。1995年，网景招募了布兰登·艾克，目标是把Scheme语言嵌入到Netscape Navigator浏览器当中。但更早之前，网景已经跟昇阳合作在Netscape Navigator中支持Java，这时网景内部产生激烈的争论。后来网景决定发明一种与Java搭配使用的辅助脚本语言并且语法上有些类似，这个决策导致排除了采用现有的语言，例如Perl、Python、Tcl或Scheme。为了在其他竞争提案中捍卫JavaScript这个想法，公司需要有一个可以运作的原型。艾克在1995年5月仅花了十天时间就把原型设计出来了。最初命名为Mocha，1995年9月在Netscape Navigator 2.0的Beta版中改名为LiveScript，同年12月，Netscape Navigator 2.0 Beta 3中部署时被重命名为JavaScript，当时网景公司与昇阳计算机公司组成的开发联盟为了让这门语言搭上Java这个编程语言“热词”，因此将其临时改名为JavaScript，日后这成为大众对这门语言有诸多误解的原因之一。JavaScript推出后在浏览器上大获成功.1996年11月，网景正式向ECMA（欧洲计算机制造商协会）提交语言标准。——维基百科


&emsp;HTML告诉了浏览器，要显示什么内容。CSS告诉了浏览器，这些内容的样式（大小颜色等等）。但还缺了一东西，就是动作，要实现动作就要由JavaScript来决定。现在，给按钮添加一个动作，当点击时，就会弹出提示：
```html
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
&emsp;点击时，就会弹出提示:
<button onclick="alert('你点击了按钮')">这是一个按钮</button> 

# 结给其它教程学习
&emsp;上面我只是简单地补充说明一下这HTML、CSS、JavaScript的起源与作用，里面还有很多需要学习，比较出名的教程有w3school、菜鸟教程、廖雪峰教程。当然，网上的教程还是比较浅，如果你还想要学习得更踏实，就要啃书。大约花费 __一到两个星期__ （PS:一天按八小时计算，不同人有不同的学习要求，不同的学习速度，不同的深度所以时间不一样。）
- 在线教程
[w3school](http://www.w3school.com.cn/html/index.asp)
[菜鸟教程](http://www.runoob.com/js/js-tutorial.html)
[廖雪峰教程](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000)
- 相关书籍
《Head First HTML与CSS》
《DOM 编程艺术》
《javascript 高级程序设计》
《XX天网页制作从入门到精通》（事实上学完也只能算个入门）


# 作业
&emsp;学习完那些线上教程与纸质书里的基础，我们边练边学。这里给一个示例，你们能自己亲手完成就代表HTML、CSS、JavaScript到了入门的阶段。简单例子及源代码：[HTML、CSS、JS基础练习.rar](https://test-1251805228.cos.ap-guangzhou.myqcloud.com/%E7%A4%BA%E4%BE%8B%E4%BB%A3%E7%A0%81/HTML%E3%80%81CSS%E3%80%81JS%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0.rar)
其中用到了flex布局，网上的基础教程可能没有介绍，需要自行百度了解一下。


<img class="lazy" alt="HTML、CSS、JS基础练习" data-src="http://ww1.sinaimg.cn/large/005BIQVbgy1fvtnt3j13eg31e80qfx6s.gif">

&emsp;大家参考一下源代码，如果说看一眼就知道怎么做的，就说明基础已经过了，可以进行下一节了。如果还有很多不明白的，那就要继续学习。

# FAQ
1. 为什么我按网上那些在线教程学，好像效果不怎么样？
__答：网上的教程一般般，不讲技术的诞生原因，不讲核心观念，只讲怎么用而已，所以最好能看书。另一方面，编程需要大量动手练习才能提高能力，绝对不是记一些知识点就能马上做出满意的作品。一般来说，至少模仿三到五个网页，所做出来的东西才能看一下，千万不要因为自己翻了一下书，记了一下知识点，做第一个作品效果太差就气馁。成长需要一个过程，去模仿三到五个网页吧。__
2. 怎么模仿网页？
__答：找一些简单的自己喜欢的网页，然后使用 [chrome开发者工具](/posts/52429) 分析别人是怎么做的，然后自己新自做一次。某个地方做不出来，继续分析继续做。遇到没见过的东西就多搜索，觉得超出自己水平的内容先放下。__
# 下一节
- [chrome开发者工具](/posts/52429)
&emsp;__强烈建议先学这个开发者工具，先学会调试自己的代码。__
- [Jquery、Bootstrap基础](/posts/27238)
&emsp;Jquery让JS操作DOM更加简单，Bootstrap提供优秀的样式供你直接使用，短时间内就能让页面变得十分漂亮。
- [nodejs基础](/posts/56793)
&emsp;本地打开网页，你可以注意到网址栏的协议是file，而不是http。要想让手机也能访问网页，就需要提供对外http服务，最终让手机访问网页。

# 附录
- [HTML规范文档](https://www.w3.org/TR/html/)
- [CSS1规范文档-Cascading Style Sheets, level 1](https://www.w3.org/TR/CSS1/)
- [CSS2规范文档-Cascading Style Sheets Level 2 Revision 1 (CSS 2.1) Specification](https://www.w3.org/TR/CSS2/)


