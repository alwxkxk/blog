---
title: Jquery、Bootstrap基础
toc: true
abbrlink: 27238
date: 2018-10-17 19:31:52
tags:
---

&emsp;国际惯例，大家请多参考网上的教程，重复的事我就不多做了。我就说一些网上教程没有说的事。
[jquery教程-菜鸟教程](https://www.runoob.com/jquery/jquery-tutorial.html)
[Bootstrap中文网 - 起步](https://v3.bootcss.com/getting-started/)

## 为什么用Jquery?
&emsp;软件的难点在哪里？软件的难点在于当代码量越来越大的时候，就越来越难驾驭。程序是要不断地被改进，当几万行的代码改起来比几千行的代码改起来要难得多。所以写代码时，追求的是一方面写得灵活些易于重构。另一方面是写得精简一些，下次阅读与修改代码时更省精力。
&emsp;回到为什么用Jquery？本质上就是能够让我们写代码更加精简。借用Jquery，我们可以用更少的代码，写出更容易阅读的代码。
&emsp;Jquery 的功能概括：
1. HTML 的元素选取 
2. HTML的元素操作
3. HTML dom遍历和修改
4. JavaScript特效和动画效果
5. CSS操作
6. HTML事件操作
7. __AJAX异步请求方式__

&emsp;另外，一堆的前端库是基于Jquery来写的，所以必须用这些前端库还必须使用Jquery。__搞网页，必须要学习Jquery。__ 但不必太深入，只需要了解最常用的用法即可。

## 为什么用Bootstrap？
&emsp;写CSS的时候，你是否会烦恼，挑什么颜色好看？字体要多大才合适？如此等等的问题，有没有最优的方案直接使用？有，那就是使用别人设计好的UI库，其中最流行的UI库是Bootstrap。（当然，各人有不同的审美观，所以有不同的设计方案，特别是大公司往往有自己的UI库。）学习Bootstrap是因为网上资源及相关讨论最多，方便自学。
&emsp;[Bootstrap效果](https://v3.bootcss.com/examples/theme/)：
![Bootstrap效果](/blog_images/005BIQVbgy1fwcmtp4nuoj30y60pl769.jpg)
&emsp;[Bootstrap中文网](http://www.bootcss.com/)

## 作业
&emsp;模仿一个网站是最好的学习，新手先挑一个简单的进行模仿：[bootcdn](https://www.bootcdn.cn/)。
![bootcdn网页](/blog_images/005BIQVbgy1fwcmwryxnxj31hc0q2409.jpg)
&emsp;这个网页使用Bootstrap进行布局的，自行模仿整个网页布局（要求相似度80%以上，务必先自学flex布局），具体的样式跟着用Bootstrap就行了。没搞明白怎么他是怎么做到的，就利用chrome开发者工具进行网页分析（如果还没学先学[chrome开发者工具](/posts/52429)）。
&emsp;__当你完成这个作业时，你基本已经拥有简单页面的制作能力，已经满足了此教程的前端技能要求。__ 如果你想继续往前端这个方向发展学习，就去学习三大主流框架之一[Vue](https://cn.vuejs.org/)。
&emsp;遇到什么困难或疑问的，欢迎提出讨论。

## 附录
[Jquery - 官方网站](https://jquery.com/)
[Bootstrap - 官方网站](https://getbootstrap.com/)

## FAQ

1. 怎么区分某个样式是来自于Bootstrap，还是来自于自己写的样式？
__答：使用chrome开发者工具分析可以看到具体的CSS是来自于哪个文件。__
![](/blog_images/005BIQVbgy1fxqb0tbdchj31hc0q20wf.jpg)

2. 那个bootcdn网站上的有一些图片，我没有呀，怎么模仿？
__答：能在网页上展示出来的都可以从chrome开发者工具里找到，包含图片，都可以下载到本地供自己使用！__
![](/blog_images/005BIQVbgy1fxqb4omlslj31hc0t40ww.jpg)