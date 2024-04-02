---
title: zlmediakit调试记录
toc: true
abbrlink: 42542
date: 2024-04-02 17:31:26
tags:
---


### 缺失libsrtp2-1.dll
&emsp;最近公司安排我研究zlmediakit来实现将监控视频转换成FLV视频流进行播放，在windows下运行总是提示缺失libsrtp2-1.dll。我看文档这个应该是跟webRTC有关，在cmake里尝试把cmakelists.text里的option(ENABLE_WEBRTC "Enable WebRTC" ON) 把ON改成 OFF再编译，运行时还是提示缺失。最后在[dllme.com](https://www.dllme.com/)来下载了libsrtp2-1.dll放到MediaServer.exe目录下，就可以运行了。另附[libsrtp2-1.dll-百度网盘](https://pan.baidu.com/s/1uoLsN_bVfPxF2IS-xa6PYQ?pwd=uk3g)供大家下载。

### secret值
&emsp;在使用postman调试API时，secret值是在MediaServer.exe目录下config.ini里找，这个是配置文件。