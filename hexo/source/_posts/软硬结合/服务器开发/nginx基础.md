---
title: nginx基础
toc: true
tags:
  - nginx
abbrlink: 19114
date: 2018-12-30 11:28:10
---

&emsp;阅读要求：会Linux基本操作、会编辑文本（比如会vi）。
&emsp;在学习一个新东西新技术之前，一般会先去搜索关键字，了解这个东西是为了解决什么问题，具体的应用场景是什么。
[Nginx 相关介绍(Nginx是什么?能干嘛?) - 蔷薇Nina - 博客园](https://www.cnblogs.com/wcwnina/p/8728391.html)

## CentOS安装nginx
&emsp;这里演示一下如何在centOS安装nginx，并且能访问网址。如果是本地虚拟机，注意要先保证能Ping通（保证网络连通），以及开放80端口或者关闭防火墙（可参考[centOS 7防火墙相关命令](/posts/34982/#centOS-7防火墙相关命令)）。
&emsp;根据[官方文档安装指引](http://nginx.org/en/linux_packages.html#RHEL-CentOS)，复制命令即可。

```bash
sudo yum install yum-utils -y

# 先检查yum源 是否包含nginx安装包，若没有内容显示出来，则按以下操作添加yum源
yum list | grep nginx

# 添加yum源：，创建并编辑 /etc/yum.repos.d/nginx.repo
vi /etc/yum.repos.d/nginx.repo

# 添加yum源：将以下内容添加到 文本中
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key

[nginx-mainline]
name=nginx mainline repo
baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://nginx.org/keys/nginx_signing.key

# 保存文本并退出，开始安装
# 再次使用命令： yum list | grep nginx 检查，成功后开始安装：
sudo yum install nginx -y
# 若提示No package nginx available. 说明yum源不存在，检查上面的操作是否正确。

# 检验nginx安装成功，并可运行
nginx -v

```

&emsp;根据[官方文档新手指引](http://nginx.org/en/docs/beginners_guide.html)执行命令：
```bash
# 启动nginx
sudo service nginx start

# 使用telnet 进行HTTP访问测试 本地测试 nginx 80 端口
telnet 127.0.0.1 80
GET /index.html

# 空行 回车 以发送 telnet命令
```
&emsp;正常时会返回一串HTML文本，说明nginx正常运行、如图所示：
![](/blog_images/005BIQVbly1g25x07y1iaj31bo0l9dgu.jpg)
&emsp;若不正常说明nginx启动失败，检查哪一步出错了。
&emsp;使用浏览器访问其IP地址，一样能显示网页如图所示：
![](/blog_images/005BIQVbly1g25x21ncjdj31hc0o3dgo.jpg)
&emsp;若本地测试正常，但浏览器却无法正常访问，请检查服务器是否能连接（ping通）、防火墙设置、云服务器安全组是否开放了端口。

## 常用配置
&emsp;配置文件一般在`/etc/nginx/nginx.conf`，可打开并编辑修改。
&emsp;修改完配置后，先执行`nginx –t`命令，检测一下配置文件有没写错，若无报错就可以正式重启了，执行`nginx -s reload`启动nginx。

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