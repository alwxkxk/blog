---
title: TCP协议基础
toc: true
abbrlink: 19508
date: 2018-09-16 19:45:50
tags:
- TCP
- IP
---
&emsp;关于TCP/IP协议，先讲一下基本概念，然后搭建一个TCP通信环境，通过抓包分析数据进行讲解。__套路以及大部分内容是来自于经典书籍《TCP/IP详解 卷一》 ，只是具体实验不同，书上在Linux环境下进行抓包，这里给出window下的抓包过程，更容易实现，有条件的朋友直接买一本来啃，会学到很多。__

![TCP/IP](/blog_images/005BIQVbgy1fz2vnupc6dj30t10dj0w1.jpg)

## 网络调试助手
&emsp;[网络调试助手-百度网盘](https://pan.baidu.com/s/1XBpeUK9QcA0r90yZkIe6fg)
&emsp;使用网络调试助手简单示例，在视频中我打开了两个调试助手，左侧是服务器端，右侧是客户端，相互发送数据，这就是TCP通信。
<video class="lazy" data-src="https://test-1251805228.file.myqcloud.com/%20%E7%BD%91%E7%BB%9C%E8%B0%83%E8%AF%95%E5%8A%A9%E6%89%8B-%E6%9C%AC%E5%9C%B0%E5%BC%80%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E4%B8%8E%E5%AE%A2%E6%88%B7%E7%AB%AF%E8%BF%9B%E8%A1%8C%E9%80%9A%E4%BF%A1.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>

---


## TCP基础
![TCP/IP协议模型](/blog_images/005BIQVbgy1fvi66culs3j30if0d674z.jpg)
&emsp;TCP（Transmission Control Protocol 传输控制协议）与UDP都是基于IP协议之上。与UDP不同，TCP提供一个面向连接的，可靠的，基于字节流的传输服务（TCP provides a connection-oriented,reliable,byte stream service.）。
- 面向连接的：这意味着使用TCP协议的两台设备（服务器端与客户端）在交互数据前必须先建立连接。
- 可靠的：保证传输不会丢失或出错。（有特定的机制去检测是否丢失或出错，若丢失或出错就会重新发送一次）
- 基于字节流的：TCP连接使用字节流来交互数据（一字节等于8位）。如果一端的应用先发送10字节，再发送20字节，再发送50字节。另一端的应用可能会读取到4次的20字节。

---

&emsp;注意了，在上一节提到，IP协议提供非可靠的，无连接的数据传输服务。TCP在此之上，额外做了一些事，有更多的特性（特别是 “可靠的”）。为了实现这个可靠的传输，TCP做了以下事情：
- 合理地将数据分成若干个segment（段），每一个段都包含一个校验各，从而能检测出端到端的传输错误，每一段使用单个IP数据报来传输。
- 每发一个segment，都必须要规定时间内接收到应答，若超时就会重新发送此segment。
- 每接收一个segment，都会发送一个应答。
- 通过检查checksum保证所传输的数据是没有被修改过的，若没通过检查就不会接收并且不作应答。
- TCP segment是由IP datagrams运输的，因为IP datagrams不保证按顺序到达，所以TCP会将它们重新正确排序。
- 因为IP datagrams有可能会发送重复的数据，所以TCP还必须丢弃重复的数据。
- TCP提供流量控制，防止发得过快而接收得太慢所导致的异常。

---

![TCP数据封装在IP数据中](/blog_images/005BIQVbgy1fwdr99chz2j30ru060glj.jpg)
&emsp;我们从上一节IP协议基础知道，TCP数据是会封装到IP数据当中，我们现在看看TCP协议的头部数据定义：
![TCP头部](/blog_images/005BIQVbgy1fwdrcbdccjj30sg0lcwfs.jpg)
- 16-bit source port number 16位源端口号 
- 16-bit destination prot number 16位目标端口号 
- 32-bit sequence number 32位顺序号 
- 32-bit acknowledgment number 32位应答号
- 4-bit header length  4位头部长度
- reserved(6 bit) 保留位
- URG 紧急标志位
- ACK 应答标志位（表明 __应答号__ 之前的数据接收成功）
- PSH 不进行缓存直接推送到应用的标志位
- RST 标志重连接的标志位
- SYN 同步顺序号以初始化连接的标志位
- FIN 发送数据完毕的标志位（表明不会再发送数据过来）
- 16-bit window size 窗口大小（用于控流）
- 16-bit TCP checksum 检验（检验传输的数据是否正确）
- 16-bit urgent pointer 当URG标志被设置时有效，传送紧急数据。
&emsp;写着写着我发现，书本上用了一百多页讨论TCP协议的内容，当年我啃了两个星期，而现在试图用一个网页就想简单介绍完那是异想天开。于是我决定不再细讲，直接抓包讲解示范TCP是怎么传输数据的。大家看过后，从整体上有个感性的认识就行了，知道原来TCP通信时是这样子的。当然，想了解更多更深入那是必须要啃书的。

---


## wireshark 分析TCP通信
&emsp;安装[wireshark-百度网盘](https://pan.baidu.com/s/17TVX8fxuVopEGAo6sf90Lg)，并开启window网卡的抓包服务（否则找不到对应的网卡），进行抓包。之前我们在本机使用两个网络调试助手进行TCP通信，是属于回环数据（可以理解为数据并没有经过真实的网卡流出去，一直在本机里互传），抓包比较麻烦。我在服务器用nodejs写了一个简单的TCP服务器端（119.29.107.47:9001，[源码-nodejs基础-#搭建最简TCP服务器](/posts/56793/#搭建最简TCP服务器)），使用网络调试助手开启客户端进行连接并发送数据，并使用wireshark抓包进行分析。
&emsp;开启windows抓包服务：
```bash
#以管理员方式运行 cmd.exe
net start npf
#启动 wireshark
```
&emsp;开启抓包服务并启动wireshark：
<video class="lazy" data-src="https://test-1251805228.file.myqcloud.com/%E5%BC%80%E5%90%AF%E6%8A%93%E5%8C%85%E6%9C%8D%E5%8A%A1%E5%B9%B6%E5%90%AF%E5%8A%A8wireshark.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>

&emsp;wireshark抓包时，会显示所有抓到的数据，为了过滤出我们想要的东西，使用过虑IP的语法：`ip.addr == x.x.x.x`，这代表目标地址与源地址包含x.x.x.x的数据显示出来。
<video class="lazy" data-src="https://test-1251805228.file.myqcloud.com/wireshark%E6%8A%93%E5%8C%85%E6%BC%94%E7%A4%BA.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>

---

&emsp;首先我们回想一下我们具体做了什么：示例的TCP服务器脚本的逻辑是：当有TCP客户端连接成功时，服务器马上发送`IP地址:端口号 connected`。客户端发送任意数据时，服务器马上响应数据`IP地址:端口号 receive : 客户端所发数据`。所抓的12条通信数据如下所示，我们一条条来分析。下方数据显示，左侧是序号，中间是具体数据，右侧是被数据对应的ASCII码。
![wireshark抓包图](/blog_images/005BIQVbgy1fwfkehuv4lj31020nxgon.jpg)

```
1-- TCP建立连接的第一次握手
0000   0c 4b 54 1e 10 b9 8c ec 4b 5e df 31 08 00 45 00   .KT..¹.ìK^ß1..E.
0010   00 34 6e 6f 40 00 80 06 00 00 c0 a8 01 79 77 1d   .4no@.....À¨.yw.
0020   6b 2f d0 79 23 29 f8 dd 37 e6 00 00 00 00 80 02   k/Ðy#)øÝ7æ......
0030   fa f0 a4 94 00 00 02 04 05 b4 01 03 03 08 01 01   úð¤......´......
0040   04 02                                             ..

2-- TCP建立连接的第二次握手
0000   8c ec 4b 5e df 31 0c 4b 54 1e 10 b9 08 00 45 00   .ìK^ß1.KT..¹..E.
0010   00 34 00 00 40 00 36 06 a0 56 77 1d 6b 2f c0 a8   .4..@.6. Vw.k/À¨
0020   01 79 23 29 d0 79 77 c8 fb 5c f8 dd 37 e7 80 12   .y#)ÐywÈû\øÝ7ç..
0030   72 10 c1 19 00 00 02 04 05 90 01 01 04 02 01 03   r.Á.............
0040   03 07                                             ..

3-- TCP建立连接的第三次握手
0000   0c 4b 54 1e 10 b9 8c ec 4b 5e df 31 08 00 45 00   .KT..¹.ìK^ß1..E.
0010   00 28 6e 70 40 00 80 06 00 00 c0 a8 01 79 77 1d   .(np@.....À¨.yw.
0020   6b 2f d0 79 23 29 f8 dd 37 e7 77 c8 fb 5d 50 10   k/Ðy#)øÝ7çwÈû]P.
0030   01 05 a4 88 00 00                                 ..¤...

4-- 建立TCP连接成功，TCP服务器主动向客户端发送：IP地址:端口号 connected
--- （对应就是最后那一部分，被解析成ASCII就是 10.135.13.174:9001 connected）
0000   8c ec 4b 5e df 31 0c 4b 54 1e 10 b9 08 00 45 00   .ìK^ß1.KT..¹..E.
0010   00 46 c4 14 40 00 36 06 dc 2f 77 1d 6b 2f c0 a8   .FÄ.@.6.Ü/w.k/À¨
0020   01 79 23 29 d0 79 77 c8 fb 5d f8 dd 37 e7 50 18   .y#)ÐywÈû]øÝ7çP.
0030   00 e5 ba ea 00 00 31 30 2e 31 33 35 2e 31 33 2e   .åºê..10.135.13.
0040   31 37 34 3a 39 30 30 31 20 63 6f 6e 6e 65 63 74   174:9001 connect
0050   65 64 2e 0a                                       ed..

5-- 客户端应答，成功接收数据
0000   0c 4b 54 1e 10 b9 8c ec 4b 5e df 31 08 00 45 00   .KT..¹.ìK^ß1..E.
0010   00 28 6e 71 40 00 80 06 00 00 c0 a8 01 79 77 1d   .(nq@.....À¨.yw.
0020   6b 2f d0 79 23 29 f8 dd 37 e7 77 c8 fb 7b 50 10   k/Ðy#)øÝ7çwÈû{P.
0030   01 05 a4 88 00 00                                 ..¤...

6-- TCP客户端发送数据（对应ASCII码是 hellow 123）
0000   0c 4b 54 1e 10 b9 8c ec 4b 5e df 31 08 00 45 00   .KT..¹.ìK^ß1..E.
0010   00 32 6e 72 40 00 80 06 00 00 c0 a8 01 79 77 1d   .2nr@.....À¨.yw.
0020   6b 2f d0 79 23 29 f8 dd 37 e7 77 c8 fb 7b 50 18   k/Ðy#)øÝ7çwÈû{P.
0030   01 05 a4 92 00 00 68 65 6c 6c 6f 77 20 31 32 33   ..¤...hellow 123

7-- 服务器应答，成功接收数据
0000   8c ec 4b 5e df 31 0c 4b 54 1e 10 b9 08 00 45 00   .ìK^ß1.KT..¹..E.
0010   00 28 c4 15 40 00 36 06 dc 4c 77 1d 6b 2f c0 a8   .(Ä.@.6.ÜLw.k/À¨
0020   01 79 23 29 d0 79 77 c8 fb 7b f8 dd 37 f1 50 10   .y#)ÐywÈû{øÝ7ñP.
0030   00 e5 72 cb 00 00 00 00 20 20 20 20               .årË....    

8-- 服务器发送数据（对应 10.135.13.174:9001 receive : hellow 123）
0000   8c ec 4b 5e df 31 0c 4b 54 1e 10 b9 08 00 45 00   .ìK^ß1.KT..¹..E.
0010   00 4f c4 16 40 00 36 06 dc 24 77 1d 6b 2f c0 a8   .OÄ.@.6.Ü$w.k/À¨
0020   01 79 23 29 d0 79 77 c8 fb 7b f8 dd 37 f1 50 18   .y#)ÐywÈû{øÝ7ñP.
0030   00 e5 73 61 00 00 31 30 2e 31 33 35 2e 31 33 2e   .åsa..10.135.13.
0040   31 37 34 3a 39 30 30 31 20 72 65 63 65 69 76 65   174:9001 receive
0050   3a 20 68 65 6c 6c 6f 77 20 31 32 33 0a            : hellow 123.

9-- 客户端应答，成功接收数据
0000   0c 4b 54 1e 10 b9 8c ec 4b 5e df 31 08 00 45 00   .KT..¹.ìK^ß1..E.
0010   00 28 6e 73 40 00 80 06 00 00 c0 a8 01 79 77 1d   .(ns@.....À¨.yw.
0020   6b 2f d0 79 23 29 f8 dd 37 f1 77 c8 fb a2 50 10   k/Ðy#)øÝ7ñwÈû¢P.
0030   01 05 a4 88 00 00                                 ..¤...

10-- 客户端结束TCP连接，不再发送数据。
0000   0c 4b 54 1e 10 b9 8c ec 4b 5e df 31 08 00 45 00   .KT..¹.ìK^ß1..E.
0010   00 28 6e 74 40 00 80 06 00 00 c0 a8 01 79 77 1d   .(nt@.....À¨.yw.
0020   6b 2f d0 79 23 29 f8 dd 37 f1 77 c8 fb a2 50 11   k/Ðy#)øÝ7ñwÈû¢P.
0030   01 05 a4 88 00 00                                 ..¤...

11-- 服务器响应 结束TCP连接，不再发送数据。
0000   8c ec 4b 5e df 31 0c 4b 54 1e 10 b9 08 00 45 00   .ìK^ß1.KT..¹..E.
0010   00 28 c4 17 40 00 36 06 dc 4a 77 1d 6b 2f c0 a8   .(Ä.@.6.ÜJw.k/À¨
0020   01 79 23 29 d0 79 77 c8 fb a2 f8 dd 37 f2 50 11   .y#)ÐywÈû¢øÝ7òP.
0030   00 e5 72 a2 00 00 00 00 20 20 20 20               .år¢....    

12-- 客户端应答，成功接收数据。
0000   0c 4b 54 1e 10 b9 8c ec 4b 5e df 31 08 00 45 00   .KT..¹.ìK^ß1..E.
0010   00 28 6e 75 40 00 80 06 00 00 c0 a8 01 79 77 1d   .(nu@.....À¨.yw.
0020   6b 2f d0 79 23 29 f8 dd 37 f2 77 c8 fb a3 50 10   k/Ðy#)øÝ7òwÈû£P.
0030   01 05 a4 88 00 00                                 ..¤...

```
&emsp;数据分析时注意分层，最后那一层才是TCP协议的内容：
![wireshark-1](/blog_images/005BIQVbgy1fwfv8bhxxdj31060nwtav.jpg)
![wireshark-2](/blog_images/005BIQVbgy1fwfv96r0ilj31060nwace.jpg)
![wireshark-3](/blog_images/005BIQVbgy1fwfv9h0k85j31060nwmzj.jpg)

---


### TCP建立连接与结束连接
&emsp;上面12条通信数据，第1，2，3条是用于建立TCP连接，第4，5，6，7，8，9条是传输数据与应答，第10，11，12条是TCP结束连接。
&emsp;在分析协议之前，简单说一下建立连接时所需要做的 __三次握手__ ：
1. 客户端首先向服务器发起连接请求，标志SYN。
2. 服务器端返回顺序号，标志SYN，对第一步的数据作出应答表明接收成功，标志ACK。
3. 客户端对第二步的数据作出应答表明接收成功，标志ACK。

&emsp;[知乎 - TCP 为什么是三次握手，而不是两次或四次？](https://www.zhihu.com/question/24853633)

---


```
1-- TCP建立连接的第一次握手
0000   0c 4b 54 1e 10 b9 8c ec 4b 5e df 31 08 00 45 00   .KT..¹.ìK^ß1..E.
0010   00 34 6e 6f 40 00 80 06 00 00 c0 a8 01 79 77 1d   .4no@.....À¨.yw.
0020   6b 2f d0 79 23 29 f8 dd 37 e6 00 00 00 00 80 02   k/Ðy#)øÝ7æ......
0030   fa f0 a4 94 00 00 02 04 05 b4 01 03 03 08 01 01   úð¤......´......
0040   04 02   
```
&emsp;这里我们直接从TCP协议开始分析：
![tcp-1](/blog_images/005BIQVbgy1fwfvcp6nakj31060nwacu.jpg)

![TCP头部](/blog_images/005BIQVbgy1fwdrcbdccjj30sg0lcwfs.jpg)
- 16-bit source port number 16位源端口号 
- 16-bit destination prot number 16位目标端口号 
- 32-bit sequence number 32位顺序号 
- 32-bit acknowledgment number 32位应答号
- 4-bit header length  4位头部长度
- reserved(6 bit) 保留位
- URG 紧急标志位
- ACK 应答标志位（表明 __应答号__ 之前的数据接收成功）
- PSH 不进行缓存直接推送到应用的标志位
- RST 标志重连接的标志位
- SYN 同步顺序号以初始化连接的标志位
- FIN 发送数据完毕的标志位（表明不会再发送数据过来）
- 16-bit window size 窗口大小（用于控流）
- 16-bit TCP checksum 检验（检验传输的数据是否正确）
- 16-bit urgent pointer 当URG标志被设置时有效，传送紧急数据。

```
d0 79 ==》十六进制转换成十进制为53369，以下同理。源端口号为53369
23 29 ==》目标端口号为9001
f8 dd 37 e6 ==》顺序号
00 00 00 00 ==》应答号为0
80 02 ==》前四位代表头部长度为32bytes，中间六位保留不用，最后六位为标志位，只标志了SYN
fa f0 ==》窗口大小 
a4 94 ==》TCP检验
00 00 ==》紧急指针
02 04 05 b4 01 03 03 08 01 01 04 02 ==》options
```
&emsp;同理，前三个通信数据可以这样一一分析，这就是三次握手。中间第4，5，6，7，8，9条传输数据及应答，可以自行分析。最后是关闭连接时的，涉及到TCP半关闭的内容，有兴趣可以啃书了解，为什么要这样做。
&emsp; __看到这里，你会有很多疑问，怎么这也没说，那也没说，怎么学？那是因为网页上的教程只能感性地让你了解个大概，如果每一知识点都详说，那是几百页书的内容，这里点到即止。我强烈建议大家去啃一下《TCP/IP详解 卷一》，这样才能深入了解。__

---


## 自定义应用协议
&emsp;这里我们讨论一下，在TCP协议基础之上，到底要传些什么内容？
&emsp;要传什么内容，完全是由要做什么事情决定的。比如说我手上有个设备用来控制一个LED开关的，由于LED灯只有两个状态（开与关，分别可以用1跟0代表），我们可以只用一位来进行表示，那么我们就可以定义，客户端向服务器端发送的数据：
- `0x00`代表LED处于关灯状态
- `0x01`代表LED处于开灯状态

&emsp;当然，客户端可以向服务器端汇报这个LED灯处于什么状态，服务器端理应也可以向客户端发送数据，我们这里就让服务器端向客户端发送控制命令，服务器端向客户端发送的数据：
- `0x00`代表控制设备去关灯
- `0x01`代表控制设备去开灯

&emsp;假如该设备有两个LED灯，我们可以用最后一位代表第一个LED灯，倒数第二位代表第二个LED灯,客户端向服务器端发送的数据：
- `0x00`：LED1(关灯)，LED2（关灯）
- `0x01`：LED1（开灯），LED2（关灯）
- `0x02`：LED1(关灯)，LED2（开灯）
- `0x03`：LED1（开灯），LED2（开灯）

&emsp;假设我们有三个LED灯....四个...五个...六个...二百个LED灯....按这种定义方法，玩到后面竟然要二百位才能全部代表这二百个LED灯的的状态，明显不合理。我们可以分开成“LED灯号 + 开关状态”，用前八位代表灯号，后八位代表灯的状态：
- `0x01 0x01`：LED1（开灯）
- `0x02 0x00`：LED2（关灯）
- `0xff 0x01`: LED255（开灯）

&emsp;现在假如，设备上有个温度传感器，检测到当前为24度（24 ==》 0x18），我们可以把温度放到后面，客户端向服务器端发送数据：
- `0x01 0x01 0x18`：LED1（开灯），24度

&emsp;哈？你也有二百个温度传感器？别怕，同理我再搞8位出来专门用来标志第几个传感器：
- `0x01 0x01 0x03 0x18`：LED1（开灯），温度传感器3（24度）

&emsp;哈哈？你手上有二百个这样的设备？没事，同理，我在前面专门搞8位代表设备号：
- `0x02 0x01 0x01 0x03 0x18`：设备2，LED1（开灯），温度传感器3（24度）

&emsp;哈哈哈？你手上这样的设备已经有500个这样的设备（8位最多只能0-255，共256个设备），那我只能搞16位来代表：
- `0x00 0x02 0x01 0x01 0x03 0x18`：设备2，LED1（开灯），温度传感器3（24度）

&emsp;我再讲个故事，当年我前一家公司所设计的协议，以为用8位数就够了，整个软硬件系统都是基于这一套协议来搞的，谁知道新的需求超出了这个范围，升级协议的代价很大，不仅软硬件的代码都要改，而且还得要兼容已经卖出的正在运行的产品，emmm.....
&emsp;从上面可以看出一些问题：
1. 自定义通信协议时，会根据实际情况的改变而改变。如果一开始设计不合理，就会新的与旧的不兼容问题。
2. 位数设少了可能不够用，位数设多了又浪费位置。（设计得越短，所传输的内容就越少，效率也就越高）

&emsp;所以我们设计协议时，最好能设计出一种扩展性好兼容性好的协议，别想了，这样的东西别人早就搞好了：TVL格式。
## TVL格式
&emsp;自行百度搜索吧....

## 作业
&emsp;使用wireshark亲自分析一次TCP通信，会分析TCP header。建立连接时的三次握手，传输数据，接收应答，关闭连接。只有这样，才会真实地感受到协议是怎么跑的，以后就可以大胆地看协议相关的内容，什么HTTP呀什么MQTT呀，一点都不虚。

## 附录
- [《TCP/IP详解 卷一》 在线阅读](http://www.52im.net/topic-tcpipvol1.html?mobile=no)
- linux下可以使用tcpdump来抓包，所抓的包可以使用wireshark加载进行分析。
- [wireshark不能在window下抓取回环（Loopback）数据](https://wiki.wireshark.org/CaptureSetup/Loopback)
&emsp;If you are trying to capture traffic from a machine to itself, that traffic will not be sent over a real network interface, even if it's being sent to an address on one of the machine's network adapters. This means that you will not see it if you are trying to capture on, for example, the interface device for the adapter to which the destination address is assigned. You will only see it if you capture on the "loopback interface", if there is such an interface and it is possible to capture on it; see the next section for information on the platforms on which you can capture on the "loopback interface".
&emsp;See CaptureSetup/NetworkMedia for Wireshark capturing support on various platforms. Summary: you can capture on the loopback interface on Linux, on various BSDs including Mac OS X, and on Digital/Tru64 UNIX, and you might be able to do it on Irix and AIX, but you definitely cannot do so on Solaris, HP-UX, or Windows.

- [What is the loopback device and how do I use it?](https://askubuntu.com/questions/247625/what-is-the-loopback-device-and-how-do-i-use-it)
&emsp;The loopback device is a special, virtual network interface that your computer uses to communicate with itself. It is used mainly for diagnostics and troubleshooting, and to connect to servers running on the local machine.
