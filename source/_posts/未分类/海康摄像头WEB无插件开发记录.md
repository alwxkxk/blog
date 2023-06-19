---
title: 海康摄像头WEB无插件SDK开发记录
toc: true
abbrlink: 20990
date: 2022-01-18 11:14:10
tags:
---

&emsp;最近在研究海康摄像头WEB无插件开发（在此之前使用转码工具转RTSP来播放，比较吃服务器的性能），使用下来感觉这玩意还没成熟稳定，所以还有蛮多问题的，记录一下。

## HTTPS播放要开启Websockets
&emsp;首先要开启https，并且要启用Websockets（否则会因为wss连接不成功而提示预览失败，这个卡了我很久最终领导试的时候才发现的，这玩意不放在一起真是坑死我了。），然后可以通过https来访问摄像头正常播放了：
![hkvideo-https](/blog_images/未分类/hkvideo-https.webp)
![hkvideo-wss](/blog_images/未分类/hkvideo-wss.webp)

## WEB无插件SDK开发时发现wss播放异常
&emsp;WEB无插件SDK本质就是在中间多加一个nginx进行转发，nginx通过请求中的Cookie找到摄像头的IP地址进行转发（海康通过这种cookie值来跳转还是蛮新奇的，我还第一次见这种操作）：
![海康无插件SDK转发.webp](/blog_images/未分类/海康无插件SDK转发.webp)

&emsp;开发时，我使用的是21年9月份的版本(WEB无插件开发包_20210918_20210922140917)，http/ws播放正常，而https/wss播放是有问题的，经过修改了部分SDK的代码（经过压缩过的代码改起来是蛮麻烦的），终于连上去了。但经修改后的wss直接连接的是摄像头的地址而不是nginx地址导致了证书问题，会提示`failed: Error in connection establishment: net::ERR_CERT_AUTHORITY_INVALID`(这里我使用的chrome只会提示`failed:`，用Edge才有完整的错误提示，这个也坑了我好久，之前我一直瞎尝试，用了Edge才发现真正的问题。 )，搜了一下是自签名证书会存在的问题，需要先让浏览器https访问摄像头让浏览器允许这个证书才能正常wss连接。（测试期间，发现我的电脑能播放，其它人的电脑不能播放，定位了大半天才发现原来是这个问题）

![浏览器打开自签名证书的网页.webp](/blog_images/未分类/浏览器打开自签名证书的网页.webp)

&emsp;虽然我改了SDK源代码来实现播放，但还是没达到真正的效果，真正的效果应该是wss连接nginx，而不是直连摄像头，这才能避开自签名证书不能播放问题以及网段不同时不能直连摄像头的问题。
&emsp;[海康Web开发包下载](https://open.hikvision.com/download/5cda567cf47ae80dd41a54b3?type=10&id=4c945d18fa5f49638ce517ec32e24e24)，现在已经是2022年1月中了，最新的版本是10月份的，仍然是无法播放HTTPS的，估计还没开发完。(而且这个版引入了新BUG，设置窗口大小无法传入百分比。)
&emsp;过完年后，领导让我继续搞，看能不能绕过，本来我是想着海康的BUG让海康自己去修，我等待官方更新就好了，但领导就是现在想要搞出来，不要拖，所以只能继续尝试。经过再次尝试，将原本wss直连摄像头的那部分代码改成指向nginx，一开始连不上，经过对比Cookie发现是里面的值错了，再次修改便成功了。nginx的配置如下：
```
	server {
		listen 443 ssl;
		server_name www.test.com;
		ssl_certificate 6749255_www.test.com.pem;
		ssl_certificate_key 6749255_www.test.com.key;
		ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
		ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
		ssl_prefer_server_ciphers on;

        location / {
		  	root   "D:\test";
            index  index.html index.htm;
		}

        location ~ /ISAPI|SDK/ {
            proxy_set_header 'sec-ch-ua' "";
            proxy_set_header 'sec-ch-ua-mobile' "";
            proxy_set_header 'sec-ch-ua-platform:' "";
            proxy_set_header 'Sec-Fetch-Dest' "";
            proxy_set_header 'Sec-Fetch-Mode' "";
            proxy_set_header 'Sec-Fetch-Site' "";

            if ($http_cookie ~ "webVideoCtrlProxy=(.+)") {
                proxy_pass https://$cookie_webVideoCtrlProxy;
                break;
            }
    
        }

        location ^~ /webSocketVideoCtrlProxy {
            #web socket
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            if ($http_cookie ~ "webVideoCtrlProxyWss=(.+)") {
                proxy_pass https://$cookie_webVideoCtrlProxyWss/$cookie_webVideoCtrlProxyWsChannel?$args;
                break;
            }
        }
	}
```

&emsp;另外值得注意的是，Cookie在同域名下不同端口也是共用的，实践时我就发现http与https两个页面播放视频时会有问题，才知道原来是它们的Cookie相互覆盖了。


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

## 其它问题

### 特定版本NVR无法使用
&emsp;在开发时，发现部分NVR可以使用，部分不行，进一步定位是特定版本不行，会反复alert要求输入帐号密码，即使输入也是无法正常使用。找海康的技术支持，最终还是让我们回退到我们可以正常使用的旧版本，就可以了。

### vsplayer播放回放视频
&emsp;海康的回放视频下载到本地之后，一般的播放器是无法播放的，要用官方的播放器vsplayer。在客户现场安装时发现部分电脑运行失败，会提示`由于找不到VCRUNTIME140.dll，无法继续执行代码。重新安装程序可能会解决此问题。`重装了几次还是不行，搜了一下发现是window的通病，可以下载对应的修复工具，更好的办法是去可以的电脑里找到`C:\Windows\System32`下对应的dll文件，复制到不可以的电脑上，就可以解决问题了。

### 再次转发
&emsp;要想正常播放视频，就要保证Nginx所运行的软件所处的服务器，与摄像头或NVR网络是能通的。如果不通，那么就无法播放。有时出于网络安全考虑，服务器A与摄像头或NVR的网络是通的，但服务器B只与服务器A网络联通但与摄像头或NVR不通，那么可以让服务器B先转发至服务器A。

```
# 服务器A nginx配置
if ($http_cookie ~ "webVideoCtrlProxy=(.+)") {
    proxy_pass http://$cookie_webVideoCtrlProxy;
    break;
}
```
```
# 服务器B nginx配置
if ($http_cookie ~ "webVideoCtrlProxy=(.+)") {
    # 填写服务器A的IP地址，进行再次转发
    proxy_pass http://1.2.3.4;
    break;
}
```

&emsp;另外，当出现部分通过http接口拿的数据能正常响应，但通过websocket播放的视频数据无法播放时，也有可能是因为网络安全的设置禁用了其它端口导致的。


## 附录
- [知乎-H.264输出的时候，码率设置多少合适？](https://www.zhihu.com/question/49460691/answer/221679991)