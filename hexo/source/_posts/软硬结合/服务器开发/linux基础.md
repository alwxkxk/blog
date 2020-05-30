---
title: linux基础
toc: true
abbrlink: 34982
date: 2018-09-04 11:38:32
tags:
- linux
- CentOS
---
&emsp;搞服务器为什么要学linux，window不行吗？首先来对比两者：
- [为什么目前web服务器一般用Linux操作系统而不是windows？](https://www.zhihu.com/question/39230864)
- [微软的 Web 服务器为何能屹立不倒](https://www.zhihu.com/question/24439007)
- [Linux 作为服务器操作系统的优势是什么？](https://www.zhihu.com/question/19738282)

&emsp;总结起来就是:
- windows: 贵，简单。一个害怕英语、技术水平低的人都能操作。
- linux: __免费__ ， __开源__ ，资源消耗低（即性能更高）。对使用者要求更高。

&emsp;两者有不同的应用场景，在服务器里Linux相对主流。windows是学习起来简单，上手快，图形化界面操作起来也简单，就算英文差也没所谓（毕竟有全中文界面），但是越走到后面就会觉得越坑，出了什么问题很难解决（到这程度的话基本是头脑爆炸，面对问题有心无力）。linux学习起来相对难，上手相对慢，命令行界面操作起来也没有那么顺手，但出了问题解决起来就是一个google搜几下的事。即选择windows很难解决问题，选择linux很难学习。最后总结： __选择linux就对了（市场主流、技术含量也高）。__  除了大银行为首的不缺钱的超大型公司以及只能出低工薪请技术水平低的技术人员的小公司会使用windows作为服务器系统外，其它正常点的公司都使用Linux。
&emsp;害怕英语怎么办？翻译在手，天下我有~ （反正我一个刚过四级线几分的英语文盲都没事。技术类表达都是力求简单直白，不会有语法，只要不是对英文有恐惧心理，拿起翻译软件就行了。）

## 选择哪个教程与操作系统
- 国内常用的入门书籍：《鸟哥的linux私房菜》[-在线版](http://linux.vbird.org/)
- 评价最高的入门书籍：《Red Hat Linux用户基础》
- [《快乐的 Linux 命令行》-在线版](http://billie66.github.io/TLCL/book/index.html)
- [马哥的linux视频教程](https://ke.qq.com/course/119808)

![](/blog_images/005BIQVbgy1fz2vlzdrkbj30ss0dfad2.jpg)



&emsp;有那么多的linux操作系统，到底学哪个呢？答：新手学习用得最多的系统，理应用ubuntu。然而入门教程《鸟哥的linux私房菜》是基于centOS的，两者命令还是有点不一样的，最后决定用 __centOS__ 来演示。（ubuntu用起来更方便，而centOS更稳定所以商业上主要用它。）学习的时候，切记需要什么学什么，不要一脑子学全部，学不完的。命令行常用的不超过30个，而且都是写在笔记软件中，需要哪个查哪个，反正我又不是运维人员，不是天天都用，所以也没去记。

## 本地虚拟机安装linux
&emsp;要学习linux，先学习怎么搭一个环境出来，方便反复折腾。虚拟机软件我以[虚拟机virtualbox-官网](https://www.virtualbox.org/)，[-百度网盘](https://pan.baidu.com/s/1vCcrdepimiI9Pu3A7Zo3rw)演示。（记住一件事，不管你在虚拟机上怎么折腾，都不会把电脑搞坏的，事实上学习Linux的过程中会不断地折腾重装linux。）安装时选择中文界面，安装完后新建虚拟机：

<video class="lazy" data-src="https://test-1251805228.file.myqcloud.com/%E6%96%B0%E5%BB%BA%E8%99%9A%E6%8B%9F%E6%9C%BA.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">your browser does not support the video tag</video>


&emsp;[centos镜像下载-官网](https://www.centos.org/download/):使用迅雷下载比较快。(超8G了不能放网盘)。安装过程如下：（按右边的Ctrl+鼠标就能让鼠标离开虚拟机的绑定。）

<video class="lazy" data-src="https://test-1251805228.file.myqcloud.com/%E5%AE%89%E8%A3%85centos.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">your browser does not support the video tag</video>

&emsp;前几次安装linux可以选中文界面，熟悉后就要换成英文的了，切不可对中文产生依赖。

## 基本操作

&emsp;先学习基础[《鸟哥的linux私房菜》](http://linux.vbird.org/linux_basic/)，我看了一下在线的目录，学习 __前十章__ 即可。有条件去借或买纸质书，有疑问多搜索。学习的过程中，把命令记到你的笔记软件里，有需要时查找。__千万不要背，用得多的命令自然会记下来，不常用的命令查就能解决了。__ 大约学习一到两个星期吧，学会基本的操作就够了（毕竟又不是要你考试什么的，能满足自己平时操作需要就够了。）万一把Linux玩坏了怎么办？重新在虚拟机上重装一个就行了~
&emsp;我个人常用命令：
```bash
#命令补全
[Tab]

#中断命令
[CTRL + c]

#文件列表
ls 

#改变文件权限
chmod 

#显示当前目录
pwd 

#新建目录
mkdir 

#移动文件，也可用于重命名
mv 

# 监视进程的活动与系统负载。“任务管理器” 按M 按占用内存大小排序，按P为CUP排序
top

#显示当前进程状态 ,ps -aux 显示所有进程 ，常用 ps -aux | grep xxx 来看某些相关进程
ps

# 结束某个进程 ,kill -9 123 代表杀死pid为123的进程
kill 

# ubuntu下切换root用户
sudo -s

#下载网络资源
wget 

#测试连接
ping 

# 使用 telnet测试本地的HTTP是否可以访问
telnet 127.0.0.1 80
GET /index.html

# 特别注意最后要空行 回车 以结束

#vi 编辑文件
vi

# 查看文件末尾，常用tail -f log.txt 来看日志实时更新的内容
tail

# xshell 上传下载文件 
rz
sz

```

## 使用Xshell终端登陆

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
<video class="lazy" data-src="https://test-1251805228.file.myqcloud.com/%E8%AE%BE%E7%BD%AEip%E5%B9%B6%E7%94%A8Xshell%E7%99%BB%E9%99%86.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>
&emsp;Xshell十分方便，复制粘贴功能十分有用，出了问题直接把它复制到搜索栏，太长的命令直接复制进去。还能用它来上传文件，有兴趣可搜索一下。

## 使用WinSCP上传下载文件

&emsp;给服务器上传下载文件，一般是用winSCP:
<video class="lazy" data-src="https://test-1251805228.file.myqcloud.com/%E4%BD%BF%E7%94%A8WinSCP%E4%B8%8A%E4%BC%A0%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>

## centOS安装Nodejs
&emsp;我发现官网并没有讲yum安装，搜索了一下别人是直接下载二进制包并配置PATH进行使用。
![](/blog_images/005BIQVbgy1fztfgilm70j31hc0o5gn5.jpg)
```bash
yum install wget 
cd ~

# 使用wget下载bin文件，链接如图所示复制，在xshell终端 可粘贴
wget https://nodejs.org/dist/v10.15.1/node-v10.15.1-linux-x64.tar.xz

# 解压
xz -d node-v10.15.1-linux-x64.tar.xz
tar -xf node-v10.15.1-linux-x64.tar

#添加node bin目录到PATH，使其命令以及全局安装的模块命令 能直接在bash使用
vi /etc/profile
# 在最后一行添加目录并退出
PATH=$PATH:~/node-v10.15.1-linux-x64/bin
# 启用
source /etc/profile

#检查路径是否在里面
echo $PATH

# 验证
node -v
npm -v
```

## centOS 7防火墙相关命令
&emsp;在centOS里，必须要先设置开放端口否则无法在这个端口通信（即使你运行了demo1，demo2，你没有开放9002，9003端口，硬件仍然无法连接上服务器。）。注意centOS 6与centOS 7 的防火墙是不一样的，这里只写centsOS 7。
&emsp;Centos 7 firewall 命令：
```bash

#查看已经开放的端口：
firewall-cmd --list-ports

#开启端口
firewall-cmd --zone=public --add-port=80/tcp --permanent
#命令含义：
#–zone #作用域
#–add-port=80/tcp #添加端口，格式为：端口/通讯协议
#–permanent #永久生效，没有此参数重启后失效

firewall-cmd --reload #重启firewall
systemctl stop firewalld.service #停止firewall
systemctl disable firewalld.service #禁止firewall开机启动
```


## 云服务器
&emsp;在虚拟机里玩linux一段时间后，就应该玩云服务器了。新注册用户有一段免费时间可以使用，如果你是学生党，免费时间后务必购买学生机，大约10元/月(比一杯奶茶还便宜，基本上对于云服务商来说是亏本生意，绝对划算。)。阿里云或腾讯云都行（可以先免费用一家，用完后再免费用另一家），新用户使用推广链接购买能再便宜一点点:
- [腾讯云新用户推广](https://cloud.tencent.com/redirect.php?redirect=1025&cps_key=baa84ded7a9778d3aa1addcd4fbb8b24&from=console)
- [阿里云新用户推广](https://promotion.aliyun.com/ntms/yunparter/invite.html?userCode=pkzf7btf)

两个都有在线实验室可体验，方便新手学习入门，教程是相当地好，十分推荐：
- [阿里云-开放实验室](https://edu.aliyun.com/lab/)
- [腾讯云-在线实验室](https://cloud.tencent.com/developer/labs)



