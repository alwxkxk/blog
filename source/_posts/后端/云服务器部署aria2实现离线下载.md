---
title: 云服务器部署aria2实现离线下载
toc: true
abbrlink: 2944
date: 2023-12-23 11:09:39
tags:
img: /blog_images/后端/aria2开放端口.webp
---

&emsp;最近买了阿里云的198两年的2核 2G 3M的轻量云，为了不让它吃灰，就折腾一下看看有啥好玩的东西，发现Aria2离线下载有点意思。用了一段时间后，感觉它的应用场景如下：
1. 离线下载：磁力连接、种子等点对点传输协议的文件。
2. 利用云服务器的高速网络下载文件。（之前我下载一个几G的文件，本地电脑每秒10KB，实在受不了，使用云服务器Aria2下载一下发现它每秒10MB，我再从云服务器下载下来，虽然轻量云限制导致我下载时只有300KB，但依旧快很多。）

## 安装操作
&emsp;操作如下，先安装Aria2：
```cmd
yum -y update

# 安装screen
yum -y install screen

# 进入screen，保证运行aria2在这个screen环境里一直运行
screen -S aria2


# 安装Aria2 ,注意设置你的密码(--rpc-secret yourPassword) 
# 这样在webui-aria2的前端界面里设置密码才能正常访问，不让外人知道。
yum -y install aria2
aria2c --enable-rpc --rpc-listen-all  --rpc-secret yourPassword

# 退出当前screen
# 按 【Ctrl+a】 再按 【Ctrl+d】

```
&emsp;为了使用`webui-aria2`前端界面，所以我们还要下载并安装它，以及nginx配置对应的信息（我提供我的配置供你们参考）。
```cmd
cd /root
# 下载webui-aria2文件
# 或者百度网盘下载，自己放上去也行。
# 链接：https://pan.baidu.com/s/1pUml0nAAOR6FvkaBegY2OQ?pwd=990p 
# 提取码：990p
wget https://github.com/ziahamza/webui-aria2/archive/master.zip

# 解压文件
yum install -y unzip 
unzip webui-aria2-master.zip

# 安装nginx 
yum install -y nginx

# 修改nginx 配置：vi操作 或者下载到本地修改完再上传替换与行，看你们的操作。

```

&emsp;修改nginx配置，其中`8080`用来访问webui-aria2的，`8081`是用来在webui-aria2下载对应的文件用的：
```
    server {
        listen       8080;
        listen       [::]:8080;
        server_name  _;
        root         /root/webui-aria2-master/docs;

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }

    server {
        listen       8081;
        listen       [::]:8081;
        server_name  _;
        root         /root;

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
```

&emsp; 然后启动nginx ，并配置云服务器的安全组开放对应的端口。之后应该就能访问`{你服务器的IP地址}:8080`打开webui-aria2界面，设置->连接设置，填写当时你设置的密码，就能正常使用了。
```cmd
# 测试修改配置是否正常
nginx -t

# 启动nginx 
systemctl start nginx
```

![aria2开放端口](/blog_images/后端/aria2开放端口.webp)


## 下载百度云文件操作
&emsp; 下载百度云文件需要配合油猴脚本([网盘直链下载助手 ](https://www.youxiaohou.com/install.html))解析出直连下载，再填进去。填进去如下图所示，注意去掉双引号，header换行填写。经测试，反复使用会导致被拒绝（参数填错会报`HTTP response header was bad or unexpected`，被百度拒绝会提示`download was unsuccessful`，被拒绝后我感觉换个cookie可能会好，但还没尝试。），下载速度与IDM比也没优势，其实没啥优势。
![aria2下载百度云文件1](/blog_images/后端/aria2下载百度云文件1.webp)
![aria2下载百度云文件2](/blog_images/后端/aria2下载百度云文件2.webp)


## 附录
- [搭建aria2网站](https://www.cnblogs.com/huanhao/p/webaria2.html)
- [网盘直链下载助手 ](https://www.youxiaohou.com/install.html)
