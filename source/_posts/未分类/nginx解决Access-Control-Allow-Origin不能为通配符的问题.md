---
title: nginx解决Access-Control-Allow-Origin不能为通配符的问题
toc: true
abbrlink: 11446
date: 2021-10-08 22:14:15
tags:
---

在nginx配置了Allow-Credentials为true时,且Allow-Origin为通配符`*`时：
```
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Credentials' 'true';
```
浏览器会提示报错：
```
Access to XMLHttpRequest at 'http://127.0.0.1:8081/test' from origin 'http://127.0.0.1:8081' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.
```

解决的办法就是，让nginx读取请求的域并填进去，使用$http_origin动态读取域名，然后自动填写到header里：
```
    add_header 'Access-Control-Allow-Origin' $http_origin;
    add_header 'Access-Control-Allow-Credentials' 'true';
```