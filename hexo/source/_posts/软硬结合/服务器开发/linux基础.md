---
title: linux基础
toc: true
abbrlink: 34982
date: 2018-09-04 11:38:32
tags:
---
&emsp;搞服务器为什么要学linux，window不行吗？首先来对比两者：
- [为什么目前web服务器一般用Linux操作系统而不是windows？](https://www.zhihu.com/question/39230864)
- [微软的 Web 服务器为何能屹立不倒](https://www.zhihu.com/question/24439007)
- [Linux 作为服务器操作系统的优势是什么？](https://www.zhihu.com/question/19738282)

&emsp;总结起来就是:
- windows: 贵，简单。一个害怕英语、技术水平低的人都能操作。
- linux: __免费__ ， __开源__ ，资源消耗低（即性能更高）。对使用者要求更高。

&emsp;两者有不同的应用场景，在服务器里Linux相对主流。windows是学习起来简单，上手快，操作起来也简单，就算英文差也没所谓（毕竟有全中文界面），但是越走到后面就会觉得越坑，出了什么问题很难解决（到这程度的话基本是头脑爆炸，面对问题有心无力）。linux学习起来相对难，上手相对慢，操作起来也没有那么顺手，但出了问题解决起来就是一个google搜几下的事。即选择windows很难解决问题，选择linux很难学习。最后总结： __选择linux工资会至少高几倍工资。__ 
&emsp;害怕英语怎么办？翻译在手，天下我有~ （反正我一个刚过四级线几分的英语文盲都没事。技术类表达都是力求简单直白，不会有语法，只要不是对英文有恐惧心理，拿起翻译软件就行了。）

# 选择哪个教程与操作系统
- 国内常用的入门书籍：《鸟哥的linux私房菜》[-在线版](http://linux.vbird.org/)
- 评价最高的入门书籍：《Red Hat Linux用户基础》
- [《快乐的 Linux 命令行》-在线版](http://billie66.github.io/TLCL/book/index.html)
- [马哥的linux视频教程](https://ke.qq.com/course/119808)

&emsp;有那么多的linux操作系统，到底学哪个呢？答：新手学习用得最多的系统，理应用ubuntu。然而入门教程《鸟哥的linux私房菜》是基于centOS的，两者命令还是有点不一样的，最后决定用 __centOS__ 来演示。学习的时候，切记需要什么学什么，不要一脑子学全部，学不完的。命令行常用的不超过30个，而且都是写在笔记软件中，需要哪个查哪个，反正我又不是运维人员，不是天天都用，所以也没去记。
# 本地虚拟机安装linux
&emsp;要学习linux，先学习怎么搭一个环境出来，方便反复折腾。虚拟机软件我以[虚拟机virtualbox-官网](https://www.virtualbox.org/)，[-百度网盘](https://pan.baidu.com/s/1vCcrdepimiI9Pu3A7Zo3rw)演示。（记住一件事，不管你在虚拟机上怎么折腾，都不会把电脑搞坏的，事实上学习Linux的过程中会不断地折腾重装linux。）安装时选择中文界面，安装完后新建虚拟机：
<video src="https://test-1251805228.cos.ap-guangzhou.myqcloud.com/%E6%96%B0%E5%BB%BA%E8%99%9A%E6%8B%9F%E6%9C%BA.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>
&emsp;[centos镜像下载-官网](https://www.centos.org/download/):使用迅雷下载比较快。(超8G了不能放网盘)。安装过程如下：（按右边的Ctrl+鼠标就能让鼠标离开虚拟机的绑定。）
<video src="https://test-1251805228.cos.ap-guangzhou.myqcloud.com/%E5%AE%89%E8%A3%85centos.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>
&emsp;前几次安装linux可以选中文界面，熟悉后就要换成英文的了，切不可对中文产生依赖。
# 基本操作
&emsp;先学习基础[《鸟哥的linux私房菜》](http://linux.vbird.org/linux_basic/)，我看了一下在线的目录，学习 __前十章__ 即可。有条件去借或买纸质书，有疑问多搜索。学习的过程中，把命令记到你的笔记软件里，有需要时查找。__千万不要背，用得多的命令自然会记下来，不常用的命令查就能解决了。__ 大约学习一到两个星期吧，学会基本的操作就够了（毕竟又不是要你考试什么的，能满足自己平时操作需要就够了。）万一把Linux玩坏了怎么办？重新在虚拟机上重装一个就行了~
# 使用Xshell终端登陆
&emsp;阅读所需知识：会基本的linux命令与文本编辑（vi操作）
&emsp;登陆服务器会使用终端，比较方便的工具是Xshell。这里我演示怎么通过Xshell登陆linux。安装[Xshell6个人免费版-百度网盘](https://pan.baidu.com/s/1qE8JSm6eP0uwyUmTjBiH7Q)。要登陆一台服务器，你只需要两样东西：__1.服务器的ip地址。2.拥有登陆服务器所需的密码或钥匙__
&emsp;一般直接购买云服务器，就会有一个公网IP。而我们学习用的在虚拟机上的centos，还要额外地设置，才能有内网ip：
1. 到linux里设置网卡能自动获取ip。
```bash
# 进入配置目录 
cd /etc/sysconfig/network-scripts/
# 修改网关文件，我视频中操作就是指ifcfg-enp0s3
vi 网卡名
# 修改最后一行 reboot=yes

```
2. 将linux休眠或关闭，到virtualbox里设置网卡为桥接模式（可以理解为这linux在局域网里就是台单独的电脑了）。 
3. 重新开启并进入到linux，执行reboot让系统重启。
4. `ip addr`查看IP地址有没有 192.168.X.X 的，有就是它的ip地址了。
&emsp;设置完ip后，就能Xshell登陆了，操作过程：
<video src="https://test-1251805228.cos.ap-guangzhou.myqcloud.com/%E8%AE%BE%E7%BD%AEip%E5%B9%B6%E7%94%A8Xshell%E7%99%BB%E9%99%86.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>
&emsp;Xshell十分方便，复制粘贴功能十分有用，出了问题直接把它复制到搜索栏，太长的命令直接复制进去。还能用它来上传文件，有兴趣可搜索一下。
# 使用WinSCP上传下载文件
&emsp;给服务器上传下载文件，一般是用winSCP:
<video src="https://test-1251805228.cos.ap-guangzhou.myqcloud.com/%E4%BD%BF%E7%94%A8WinSCP%E4%B8%8A%E4%BC%A0%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>
# 后续学习
