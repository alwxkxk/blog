---
title: nginx解决Too-many-header问题
toc: true
abbrlink: 65442
date: 2021-10-10 09:06:20
tags:
---


在对接海康卫视WEB无插件开发包时，自己的页面连接单独的摄像头时（连接NVR没这个问题），`/ISAPI/Security/sessionLogin`接口会报错误:

```
Access Error: 400 -- Bad Request
Too many headers
```

提示header太多，于是我就与demo所发的请求对比，发现header多了以下（少了`Authorization`）：
```
sec-ch-ua: "Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
```

解决的办法是在nginx配置里阻止这些header：
```
proxy_set_header 'sec-ch-ua' "";
proxy_set_header 'sec-ch-ua-mobile' "";
proxy_set_header 'sec-ch-ua-platform:' "";
proxy_set_header 'Sec-Fetch-Dest' "";
proxy_set_header 'Sec-Fetch-Mode' "";
proxy_set_header 'Sec-Fetch-Site' "";
```
