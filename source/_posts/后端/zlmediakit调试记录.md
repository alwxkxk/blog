---
title: zlmediakit调试记录
toc: true
abbrlink: 42542
date: 2024-04-02 17:31:26
tags:
---

&emsp;最近公司安排我研究zlmediakit来实现将监控视频转换成FLV视频流进行播放，试了一下功能确实强大。

### 缺失libsrtp2-1.dll
&emsp;在windows下运行总是提示缺失libsrtp2-1.dll。我看文档这个应该是跟webRTC有关，在cmake里尝试把cmakelists.text里的option(ENABLE_WEBRTC "Enable WebRTC" ON) 把ON改成 OFF再编译，运行时还是提示缺失。最后在[dllme.com](https://www.dllme.com/)来下载了libsrtp2-1.dll放到MediaServer.exe目录下，就可以运行了。另附[libsrtp2-1.dll-百度网盘](https://pan.baidu.com/s/1uoLsN_bVfPxF2IS-xa6PYQ?pwd=uk3g)供大家下载。

### secret值
&emsp;在使用postman调试API时，secret值是在MediaServer.exe目录下config.ini里找，这个是配置文件。

### FLV播放H265的问题
&emsp;在播放时H265时会提示：FLV播放器一船只支持H264和AAC编码，该编码格式可能不被播放器支持：H265。
&emsp;使用VLC player 与 flv.js确实都播不出来，[github issues讨论](https://github.com/ZLMediaKit/ZLMediaKit/issues/364)提到了[jessibuca播放器](https://jessibuca.com/)，测试了一下确实可以播放。
