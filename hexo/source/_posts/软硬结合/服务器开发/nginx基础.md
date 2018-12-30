---
title: nginx基础
toc: true
tags:
  - nginx
abbrlink: 19114
date: 2018-12-30 11:28:10
---

&emsp;在学习一个新东西新技术之前，一般会先去搜索关键字，了解这个东西是为了解决什么问题，具体的应用场景是什么。
[Nginx 相关介绍(Nginx是什么?能干嘛?) - 蔷薇Nina - 博客园](https://www.cnblogs.com/wcwnina/p/8728391.html)

## CentOS安装nginx

## 基本操作


### 查看日志


## 常用配置

&emsp;修改完配置后，先执行`nginx –t`命令，检测一下配置文件有没写错，若无报错就可以正式重启了。

### 配置SSL证书
&emsp;[腾讯云- Nginx 证书部署](https://cloud.tencent.com/document/product/400/4143)，配置完后重启nginx，就可以用HTTPS的方式访问网址。
```bash
server {
        listen 443;
        server_name www.domain.com; #填写绑定证书的域名
        ssl on;
        ssl_certificate 1_www.domain.com_bundle.crt;
        ssl_certificate_key 2_www.domain.com.key;
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; #按照这个协议配置
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;#按照这个套件配置
        ssl_prefer_server_ciphers on;
        location / {
            root   html; #站点目录
            index  index.html index.htm;
        }
    }
```
&emsp;websocket协议 配置SSL证书 如下：
```bash
# WebSocket 配置
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
        listen 443;
        server_name www.example.com; # 改为绑定证书的域名
        # ssl 配置
        ssl on;
        ssl_certificate 1_www.example.com.crt; # 改为自己申请得到的 crt 文件的名称
        ssl_certificate_key 2_www.example.com.key; # 改为自己申请得到的 key 文件的名称
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
        ssl_prefer_server_ciphers on;

        # WebSocket 配置
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        location / {
            proxy_pass http://127.0.0.1:8765;
        }
    }
```
### 配置二级域名
```bash
server {
  listen 80;
  #test.example.com时，会重定向到5678端口
  server_name test.example.com;
  location / {
    proxy_pass http://127.0.0.1:5678;
  }
  client_max_body_size 50M;
}
server {
  listen 80;
  #请求demo.example.com时，会重定向到9999端口
  server_name demo.example.com;
  location / {
    proxy_pass http://127.0.0.1:9999;
  }
  client_max_body_size 50M;
}
```

## 附录
- [nginx官方文档](http://nginx.org/en/docs/)