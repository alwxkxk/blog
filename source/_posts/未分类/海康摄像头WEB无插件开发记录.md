---
title: 海康摄像头WEB无插件开发记录
toc: true
abbrlink: 20990
date: 2022-01-18 11:14:10
tags:
---

&emsp;最近在研究海康摄像头WEB无插件开发（在此之前使用转码工具转RTSP来播放，比较吃服务器的性能），使用下来感觉这玩意还没成熟稳定，所以还有蛮多问题的，记录一下。

## HTTPS播放要开启Websockets
&emsp;首先要开启https，并且要启用Websockets（否则会因为wss连接不成功而提示预览失败，这个卡了我很久最终领导试的时候才发现的，这玩意不放在一起真是坑死我了。），然后可以通过https来访问摄像头正常播放了：
![hkvideo-https](/blog/blog_images/未分类/hkvideo-https.webp)
![hkvideo-wss](/blog/blog_images/未分类/hkvideo-wss.webp)

## WEB无插件开发wss播放异常
&emsp;开发时，我使用的是21年9月份的版本(WEB无插件开发包_20210918_20210922140917)，发现ws播放连接的是nginx，而wss播放是有问题的，经过修改了部分SDK的代码（经过压缩过的代码改起来是蛮麻烦的），终于连上去了。但经修改后的wss直接连接的是摄像头的地址而不是nginx地址导致了证书问题，会提示`failed: Error in connection establishment: net::ERR_CERT_AUTHORITY_INVALID`(这里我使用的chrome只会提示`failed:`，用Edge才有完整的错误提示，这个也坑了我好久，之前我一直瞎尝试，用了Edge才发现真正的问题。 )，搜了一下是自签名证书会存在的问题，需要先让浏览器https访问摄像头让浏览器允许这个证书才能正常wss连接。（测试期间，发现我的电脑能播放，其它人的电脑不能播放，定位了大半天才发现原来是这个问题）
&emsp;虽然我改了SDK源代码来实现播放，但还是没达到真正的效果，真正的效果应该是wss连接nginx，而不是直连摄像头，这才能避开自签名证书不能播放问题以及网段不同时不能直连摄像头的问题。
&emsp;[海康Web开发包下载](https://open.hikvision.com/download/5cda567cf47ae80dd41a54b3?type=10&id=4c945d18fa5f49638ce517ec32e24e24)，现在已经是2022年1月中了，最新的版本是10月份的，仍然是无法播放HTTPS的，估计还没开发完。

## 播放高清视频
&emsp;可能是解码能力有限，不能播放太高清了，主码流是一播就卡住不动了。经测试，设置播放第三码流，并设置1080P、码率上限1024Kbps，视频帧率为15，能稳定些。码率上限提高的话，稳定性差些，容易报错，有时就提示错误或，内存溢出了。估计要等更新的SDK来解决这个性能问题。本来参考demo-easy.html，播放久了会有概率报错导致视频卡住：
```
Uncaught abort(3) at Error
    at jsStackTrace (http://192.168.1.2/static/webs/codebase//playctrl/Decoder.js:1:18011)
    at stackTrace (http://192.168.1.2/static/webs/codebase//playctrl/Decoder.js:1:18182)
    at abort (http://192.168.1.2/static/webs/codebase//playctrl/Decoder.js:1:80711)
    at wasm://wasm/003b9596:wasm-function[1215]:0xb58d8
    at wasm://wasm/003b9596:wasm-function[276]:0x22625
    at wasm://wasm/003b9596:wasm-function[274]:0x2204f
    at wasm://wasm/003b9596:wasm-function[262]:0x1fa06
    at wasm://wasm/003b9596:wasm-function[249]:0x1a49e
    at wasm://wasm/003b9596:wasm-function[460]:0x479a9
    at wasm://wasm/003b9596:wasm-function[459]:0x47904
If this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.
```
有时报错：
```
Uncaught RuntimeError: memory access out of bounds
    at 003b9596:0x72859
    at 003b9596:0x22625
    at 003b9596:0x2204f
    at 003b9596:0x1fa06
    at 003b9596:0x1a49e
    at 003b9596:0x479a9
    at 003b9596:0x47904
    at 003b9596:0x47468
    at 003b9596:0xac806
    at 003b9596:0x154e
```

## 附录
- [知乎-H.264输出的时候，码率设置多少合适？](https://www.zhihu.com/question/49460691/answer/221679991)