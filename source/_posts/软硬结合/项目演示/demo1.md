---
title: 【软硬结合】demo1跑起来
toc: true
abbrlink: 64786
date: 2018-11-01 19:57:07
tags:
img: /blog_images/指向一致.webp
---

&emsp;在阅读本篇文章之前，你已经阅读了：
- [软硬结合-导读](/posts/44755)
- [NodeMCU基础](/posts/31494)
## 本篇学习内容
- 拉取Github上的本项目的代码。(建议后面抽空学习Git)
- 先看看已经部署到线上的demo1，及其能它来控制NodeMCU开发板开关灯。
- 安装最基本的软件开发环境（Chrome浏览器、vscode编辑器、NodeJs环境）。
- 本地把demo1跑起来，实现在本机上能控制NodeMCU开发板开关灯。

## 本篇视频
<iframe src="//player.bilibili.com/player.html?aid=462062924&bvid=BV16L411n7Pi&cid=379908862&page=3" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

&emsp;有读者反映安装依赖时会出现这种情况：
![安装依赖异常](/blog_images/安装依赖异常.webp)
&emsp;这个情况主要是powershell本身的问题，可以如下图所示处理，切换到cmd或者git来执行命令：
![安装依赖异常解决1](/blog_images/安装依赖异常解决1.webp)
![安装依赖异常解决2](/blog_images/安装依赖异常解决2.webp)

## 拉取所有代码
&emsp;Git是代码管理工具，我整个教程都放到Github上开源了，可以通过Git来拉取代码：[Github](https://github.com/alwxkxk/soft-and-hard)：
![获取全部源码](/blog_images/获取全部源码.webp)

&emsp;当然，你可以直接如图所示 安装Git后通过命令`git clone https://github.com/alwxkxk/soft-and-hard`来拉取代码，也可以直接点击下载Zip压缩包。

&emsp;Github作为程序员的神器之一，里面所有全世界的开源代码，你拥抱了世界，世界也就拥抱了你。建议大家注册账号并学习如何使用Git来管理你的代码，当然 __记得给我的项目点Star来支持我__ 。Git有比较好的教程：[Git教程-廖雪峰](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)，我就不再重复，这个是必学内容，__但它并不影响本教程学习，大家可以大胆先跳过，建议以后有时间抽空学习__。

&emsp;Github由于不可描述的原因，有可能会抽风连不上或者速度太慢，可以用国内的替代版Gitee，`git clone https://gitee.com/alwxkxk_admin/soft-and-hard.git`。(由于最新要求，Gitee也被迫要求要申请才能公布，我的这个仓库应该是公布的了，能下载的。)。如果你想访问github，有好心人提供了修改host的办法来解决：[hellogithub](https://raw.hellogithub.com/hosts)，把网页上的hosts写到你电脑上的Host文件即可。

&emsp;演示视频中使用了[站长工具-Ping检测](https://ping.chinaz.com/)来检测github.com是否可访问。一般来说，特殊时期会大规模不可访问，平时只是部分地区部分运营商不可访问。另外演示中我使用了特殊的办法来访问，因为不可描述的原因这个技能不教，请大家理解。
## 将NodeMCU连接线上的demo1
&emsp;我已经把demo1部署到了我的云服务器，供大家测试：
- 界面网址：[http://43.134.115.73:8001/](http://43.134.115.73:8001/)
- TCP服务器：43.134.115.73:9002

&emsp;界面网址是使用浏览器chrome访问，即可打对demo1的界面。TCP服务器是让NodeMCU连上去的。修改NodeMCU demo1的代码里的 __WIFI名称密码__，并烧录到NodeMCU中，就可以连接到线上demo1，并通过网页来控制硬件开关灯。

<iframe src="//player.bilibili.com/player.html?bvid=BV1hv411L7j3&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

&emsp;__云服务器本质上依旧是一台电脑，所以在开发阶段，我们可以完全让自己的电脑来充当这个云服务器，来进行开发调试验证，最后成功了再部署到云服务器上。__ 接下来我们先本地调试。
&emsp;经常有学习的网友很容易搞混，一会云服务器的IP地址，一会又是本地的电脑IP地址，学习的时候必须要保证：__网页访问与硬件代码所填的IP地址必须一致__，说明连的是同一台服务器。（有几个网友学习时就出现过：网页访问我的云服务器，但硬件连的却是他们本地的电脑，就问我为啥没数据，硬件跟软件连的都不一样，当然没数据啦。）
![获取全部源码](/blog_images/指向一致.webp)



## 搭建开发环境
&emsp;开发环境主要包含：Chrome浏览器（不建议使用其它浏览器）、vscode编辑器、NodeJs环境。跟着视频操作即可：
<iframe src="//player.bilibili.com/player.html?bvid=BV1H54y147cu&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>   

## 本地把demo1跑起来
&emsp;先不用急着学，让这个项目能在你手上完整地跑起来，先拥有它，能不能驾驭是另一回事。下面傻瓜式演示怎么把demo1在自己电脑上跑起来。
&emsp;如果你有nodejs与git的使用经验就会知道，默认的作法是只上传源码，而依赖包自行安装以减少git文件体积。注意需要进入到对应的目录，使用命令`npm install`安装依赖，`npm start`运行，可以看视频操作：

<iframe src="//player.bilibili.com/player.html?bvid=BV1rK4y1o74H&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

&emsp;整个过程因为没有相关基础知识，所以并不懂，很正常，经过后面的学习就会了解整个过程。(如果执行`npm install`安装依赖库时等待很久提示安装失败，可以尝试设置由淘宝提供的[国内镜像](https://npmmirror.com/)，执行命令：`npm config set registry https://registry.npmmirror.com`，验证：`npm config get registry`，如果返回`https://registry.npmmirror.com`说明设置成功，再次尝试安装`npm install`。)
&emsp;__特别注意，把代码部署到自己电脑上，只能够在局域网内访问，简单来讲就是电脑、硬件、手机等都必须是连在同一个WIFI里。当你使用手机换成流量模式而不是连接WIFI，你会发现网页无法访问。这是因为你电脑是没有公网IP（亦可称外网IP）的，只能在同一局域网里使用内网IP访问。要想让全世界的人都能访问到，让世界各地的硬件都能连接上，你必须要使用一台拥有公网IP的电脑，然后把这套代码部署上去。具体做法是租一台云服务器，安装linux系统，部署代码，设置安全组等等。__ 

&emsp;__注意区分 HTTP服务器与TCP服务器，HTTP服务器对应浏览器打开的网页，而TCP服务器对应的是硬件/网络调试助手建立TCP连接所用。__


&emsp;拥有公网IP的云服务器，本质就是一台能让世界连接上的电脑，跟你自己电脑本质差别仅仅是多了一个公网IP而已。在这台云服务器上，可以安装windows系统（不推荐）、linux系统，然后安装软件，部署代码等操作，以对外提供服务。

## 让NodeMCU连上本地的demo1
&emsp;要想NodeMCU连上本地的demo1，必须先知道自己电脑的IP地址，可以通过cmd命令行输入`ipconfig`来得到电脑的IP地址。
![打开cmd](/blog_images/打开cmd.webp)
![内网IP](/blog_images/内网IP.webp)

&emsp;然后修改NodeMCU demo1的代码里的 __IP地址__，烧录到NodeMCU中，要确保NodeMCU与电脑是在同一个WIFI网络当中，就可以了在本地跑通demo1了。部分读者实践时，发现需要 __关闭windows的防火墙__ 才能连接成功。

## 瞎折腾
&emsp;虽然说读者可能到现在什么都不懂，但这里演示如何瞎折腾，让读者获得一下拥有感，演示一下修改网页内容：
<iframe src="//player.bilibili.com/player.html?bvid=BV1GA411V7zf&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

&emsp;到这里，你已经把demo1跑起来了，虽然现在还不懂是什么东西，但是不用急，后面会教你怎么从零实现demo1，这里就是演示一下你学习后能达到的效果之一。接下来，会演示如何把demo2跑起来，一样是不教太多知识，先跑起来，让读者先看到效果，好让读者知道学完后能达到什么的程度，最后才教实现demo1，进而实现demo2。



## FAQ
1. 为什么我点击按钮没能控制LED灯亮灭？
__答：原因一：NodeMCU可能是V3版本需要定义引脚，或者硬件异常，请到[NodeMCU基础](/posts/31494)跑第一个例程，让LED灯一直闪烁确保硬件正常再跑demo1。原因二：使用了错误的浏览器（比如说IE这种旧的浏览器，360浏览器兼容模式等待），建议大家请改用chrome浏览器。现在新版的Edge也使用了chrome浏览器内核，Edge浏览器也是可以的。__

2. 把项目部署到云服务器linux中，但把SSH一关网站就访问不了了，怎么才能一直打开?
__答：学习 nodejs部署工具 PM2，可以让程序一直跑着。另外在linux系统里关闭SSH后，系统会给这个pty所关联的session中的所有进程发送SIGHUP信号，SIGHUP的默认信号处理程序是终止进程，除非进程自己处理了 SIGHUP。可以学习并使用linux 命令 `screen` ，解决这个问题。__

3. 如何使ESP8266与手机不在同一局域网也能通信?
__答：这就需要把后端程序部署到云服务器。__

4. 将服务部署到云服务器后，硬件/网关如何上传数据？
__答：本质上是一样的，在自己电脑部署时硬件通过IP地址给电脑传输数据，这个IP地址是内网的。而部署到云服务器，就拥有外网IP地址，只要硬件/网关能访问外网（WIFI、4G等）一样能给外网传略数据。云服务器注意配置安全组与防火墙开放端口，具体知识请学习[网络知识](/posts/37707)与[Linux知识](/posts/34982)。__

5. `npm install` 安装依赖库等了很久，没成功安装，怎么办？
__答：如果执行`npm install`安装依赖库时等待很久提示安装失败，可以尝试设置由淘宝提供的[国内镜像](https://npmmirror.com/)，`npm config set registry https://registry.npmmirror.com`，验证：`npm config get registry`，如果返回`https://registry.npmmirror.com`说明设置成功，再次尝试安装`npm install`。__

6. 请问这个demo1是前后端分离的吗？
__答：不是。前后端分离可以理解为 一个静态网页作为前端展示+ 一个只提供数据的后端，浏览器先加载出静态页面，然后通过HTTP请求向后端拿数据并展示。这样做的最大特点就是：前端与后端可以分别部署到两台不同的服务器上（当然也可以部署到同一台），这样有利于优化。而这个demo1，网页是先在后端拼出HTML（pug模板渲染的作用），再发送到浏览器显示，所以不能分开部署，不属于前后端分离的项目。__

7. 为什么我本地运行的demo1没有看到我的设备，但在博主的demo1示例网站上能看到我的设备？
__答：根本原因是你的设备“没有连接到你本地电脑的demo1，而是连接到我云服务器上的demo1。”，请检查硬件代码是否连接到你本地的demo1。（保证在同一网络之中，这样硬件才能连接到你本地的demo1。）__

8. 我自己创建的项目，运行`npm run start`时报错`ENOENT: no such file or directory, open '...\package.json'`
__答：实现认真看一下报错信息就容易看到哪里出问题了，这报错就是说无法打开`package.json`文件。如果有学node.js就知道，`npm run start`其实是根据`package.json`里配置的来执行对应的命令。__

9. Github国内镜像源？
__答：[有 GitHub 的国内镜像源吗？ - 知乎](https://www.zhihu.com/question/38192507)，有好心人提供了修改host的办法来解决：[hellogithub](https://raw.hellogithub.com/hosts)，把网页上的hosts写到你电脑上的Host文件即可。之前国内镜像源是可以使用的，但现在也不可以了，举例子使用官方的国内镜像的URL替代（用`https://github.com.cnpmjs.org`代替`https://github.com`）即执行命令时是：`git clone https://github.com.cnpmjs.org/alwxkxk/soft-and-hard`。__

9. 安装过程中提示`Error: EPERM: operation not permitted`
__答：这是没有操作权限的报错信息，这一般是因为把代码放到C盘或者桌面导致安装依赖时没有权限操作，需要把代码项目文件移到D盘再尝试。__
