---
title: TCP协议基础
toc: true
abbrlink: 19508
date: 2018-09-16 19:45:50
tags:
- TCP
- IP
---
&emsp;关于TCP/IP协议，先讲一下基本概念，然后搭建一个TCP通信环境，通过抓包分析数据进行讲解。（套路与经典书籍《TCP/IP详解 卷一》 大致相同，有条件的朋友直接买一本来啃，会学到很多。）

# 网络调试助手
&emsp;[网络调试助手-百度网盘](https://pan.baidu.com/s/1XBpeUK9QcA0r90yZkIe6fg)
&emsp;使用网络调试助手简单示例：
<video class="lazy" data-src="https://test-1251805228.cos.ap-guangzhou.myqcloud.com/%20%E7%BD%91%E7%BB%9C%E8%B0%83%E8%AF%95%E5%8A%A9%E6%89%8B-%E6%9C%AC%E5%9C%B0%E5%BC%80%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E4%B8%8E%E5%AE%A2%E6%88%B7%E7%AB%AF%E8%BF%9B%E8%A1%8C%E9%80%9A%E4%BF%A1.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>
&emsp;在视频中我打开了两个调试助手，左侧是服务器端，右侧是客户端，相互发送数据。


# TCP基础
![TCP/IP协议模型](http://ww1.sinaimg.cn/large/005BIQVbgy1fvi66culs3j30if0d674z.jpg)
&emsp;TCP（Transmission Control Protocol 传输控制协议）与UDP都是基于IP协议之上。与UDP不同，TCP提供一个面向连接的，可靠的，基于字节流的传输服务（TCP provides a connection-oriented,reliable,byte stream service.）。
- 面向连接的：这意味着使用TCP协议的两台设备（服务器端与客户端）在交互数据前必须先建立连接。
- 可靠的：保证传输不会丢失或出错。（有特定的机制去检测是否丢失或出错，若丢失或出错就会重新发送一次）
- 基于字节流的：TCP连接使用字节流来交互数据（一字节等于8位）。如果一端的应用先发送10字节，再发送20字节，再发送50字节。另一端的应用可能会读取到4次的20字节。

---

&emsp;注意了，在上一节提到，IP协议提供非可靠的，无连接的数据传输服务。TCP在此之上，额外做了一些事，有更多的特性（特别是 “可靠的”）。为了实现这个可靠的传输，TCP做了以下事情：
- 合理地将数据分成若干个segment，保证不会过大影响传输。
- 每发一个segment，都必须要规定时间内接收到应答，若超时就会重新发送此segment。
- 每接收一个segment，都会发送一个应答。
- 通过检查checksum保证所传输的数据是没有被修改过的，若没通过检查就不会接收并且不作应答。
- TCP segment是由IP datagrams运输的，因为IP datagrams不保证按顺序到达，所以TCP会将它们重新正确排序。
- 因为IP datagrams有可能会发送重复的数据，所以TCP还必须丢弃重复的数据。
- TCP提供流量控制，防止发得过快而接收得太慢所导致的异常。


# wireshark 分析数据
[wireshark-百度网盘](https://pan.baidu.com/s/17TVX8fxuVopEGAo6sf90Lg)
# 附录
- 《TCP/IP详解 卷一》

- [wireshark不能在window下抓取回环（Loopback）数据](https://wiki.wireshark.org/CaptureSetup/Loopback)
&emsp;If you are trying to capture traffic from a machine to itself, that traffic will not be sent over a real network interface, even if it's being sent to an address on one of the machine's network adapters. This means that you will not see it if you are trying to capture on, for example, the interface device for the adapter to which the destination address is assigned. You will only see it if you capture on the "loopback interface", if there is such an interface and it is possible to capture on it; see the next section for information on the platforms on which you can capture on the "loopback interface".
&emsp;See CaptureSetup/NetworkMedia for Wireshark capturing support on various platforms. Summary: you can capture on the loopback interface on Linux, on various BSDs including Mac OS X, and on Digital/Tru64 UNIX, and you might be able to do it on Irix and AIX, but you definitely cannot do so on Solaris, HP-UX, or Windows.

- [What is the loopback device and how do I use it?](https://askubuntu.com/questions/247625/what-is-the-loopback-device-and-how-do-i-use-it)
&emsp;The loopback device is a special, virtual network interface that your computer uses to communicate with itself. It is used mainly for diagnostics and troubleshooting, and to connect to servers running on the local machine.
