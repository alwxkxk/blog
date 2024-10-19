---
title: appwrite和parse-server部署记录
toc: true
abbrlink: 3097
date: 2024-05-04 20:43:08
tags:
img: /blog_images/后端/expectation_response_action.webp
---

&emsp;五一小长假，想着手上还有个轻量云还闲置着，折腾一下玩意后端服务平台系统。好几年前我简单测试过parse-server，最近看看别的有其它方案：[appwrite](https://appwrite.io/)、supabase、nhost。看了一下，感觉supabase太复杂，appwrite好像蛮简单，star数也多，界面也美观，只可惜里面有一部分是PHP写的，这语言我不太熟悉，就先部署测试看看。

## appwrite
&emsp;测试发现，阿里云的linux系统在跑docker时会有问题。于是重装系统centos8，再尝试[centos8 安装 docker ](https://docs.docker.com/engine/install/centos/)。
&emsp;docker跑起来，界面就能访问了，第一次登陆自行注册，当我还在怀疑这不得随便让外人注册，那这平台就不安全了啊。后来再次注册时发现，原来默认只允许注册一次，要想开放多帐号注册还得设置参数。界面上随便点点，就先去吃饭睡午觉。
&emsp;下午再次打开电脑连接服务器时发现，连不上去了，登阿里云的控制台，发现磁盘读写达到150Mb/s，拉满了。我起初以为是这可能漏洞被人攻击了，后来重装系统再尝试发现大约一个小时后，还是出现一样的问题，开始怀疑是不是轻量云的内存不足导致的异常，每逢一个小时后系统角发计划就会进入这种状态。于是想办法先找到是哪个进程占用磁盘读写高，使用top与iotop输出记录到文本里(用screen来创建多个会话)，重装系统与软件等一个小时后。
```cmd
// 每10秒记录一下top与iotop信息至文本
top -d 10 -b > top_history.txt
iotop -d 10 -b -t > iotop_history.txt
```
&emsp;top的记录信息如下，可以看出CPU方面是containerd-shim占比高，看了一下与docker相关。
```
top - 08:28:02 up  9:49,  0 users,  load average: 42.96, 37.10, 35.81
Tasks: 207 total,   4 running, 203 sleeping,   0 stopped,   0 zombie
%Cpu(s): 18.7 us,  4.6 sy,  0.0 ni,  0.0 id, 75.6 wa,  0.6 hi,  0.4 si,  0.0 st
MiB Mem :   1735.7 total,     78.6 free,   1513.9 used,    143.2 buff/cache
MiB Swap:      0.0 total,      0.0 free,      0.0 used.     66.5 avail Mem

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
   1899 root      20   0 1236720   5452      0 S  40.1   0.3   2:36.63 containerd-shim
     76 root      20   0       0      0      0 S   2.8   0.0  12:58.60 kswapd0
   1151 root      10 -10  186848   5760      0 D   0.7   0.3   4:04.64 AliYunDunMonito
   1384 root      20   0   74700   9796    464 R   0.5   0.6   4:25.59 iotop
    183 root       0 -20       0      0      0 I   0.5   0.0   2:31.74 kworker/1:1H-kblockd
   2915 root      20   0 1375512  23060      0 S   0.4   1.3  22:30.68 traefik
  21507 root      20   0  756400  15876      0 D   0.4   0.9  15:00.41 docker
   1140 root      10 -10  114900   2624      0 S   0.4   0.1   2:26.23 AliYunDun
   1004 root      20   0  689784   4792      0 S   0.4   0.3  42:33.76 aliyun-service
   1422 root      20   0 2809816  52636      0 S   0.3   3.0   4:43.12 dockerd
   1414 root      20   0 2102792  18044      0 S   0.3   1.0  11:03.40 containerd
   2656 systemd+  20   0 1542216 122432      0 S   0.3   6.9   1:26.15 mysqld
   2630 systemd+  20   0   37232   7064      0 D   0.2   0.4   0:54.57 redis-server
   3418 root      20   0   10.6g  29548      0 S   0.1   1.7   0:36.75 node
   2033 root      20   0 1236464   5160      0 S   0.1   0.3   0:30.51 containerd-shim
   2947 root      20   0   64440  27392  16860 D   0.1   1.5   1:17.53 php
    878 root      20   0   77716   1760      0 S   0.1   0.1   0:24.07 AliYunDunUpdate
   1873 root      20   0 1236208   5400      0 S   0.1   0.3   0:24.54 containerd-shim
   2099 root      20   0 1236208   5252      0 S   0.1   0.3   0:18.96 containerd-shim
   2531 root      20   0 1236464   5416      0 S   0.1   0.3   0:17.08 containerd-shim
   2748 root      20   0 1236464   5436      0 S   0.1   0.3   0:17.88 containerd-shim
   2044 root      20   0 1236464   5284      0 S   0.1   0.3   0:19.87 containerd-shim
   3324 root      20   0  366572  26916   1872 D   0.1   1.5   0:14.22 php

```
&emsp;iotop的记录信息如下，这里面读写高的就比较多了，有traefik（搜了一下，是反向代理负载均衡用的），mysqld也有，aliyun-service这些监控也有。初步估计90%的可能是appwrite的问题，要么是这个版本有问题，要么是我的轻量云内存不足会导致出现这个问题。官网上写到`Appwrite is designed to run well on both small and large deployments. The minimum requirements to run Appwrite are as little as 2 CPU cores and 4GB of RAM, with 2GB of swap memory, and an operating system that supports Docker.`，所以这玩意需要2核 4G内存，2G swap空间，我的轻量云显示性能不满足它的最低要求。 当然，我也尝试了一下先删了aliyun-service这些阿里云的监控程序进行排除，发现网上的做法都删不掉，尝试几下就放弃了，毕竟官方明说了这最低配置我都达不到，再折腾也没啥用。
```

    TIME    TID  PRIO  USER     DISK READ  DISK WRITE  SWAPIN      IO    COMMAND
b'08:28:39    3365 be/4 root        7.45 M/s    0.00 B/s  0.00 % 99.37 % traefik traefik --providers.file.directory=/storage/config --providers.file.watch=true --providers.docker=true --providers.docker.exposedByDefault=false --providers.docker.constraints=Label(`traefik.constraint-label-stack`,`appwrite`) --entrypoints.appwrite_web.address=:80 --entrypoints.appwrite_websecure.address=:443'
b'08:28:39   21530 be/7 root        2.06 M/s    0.00 B/s  0.00 % 99.31 % platform-python /usr/bin/dnf makecache --timer'
b'08:28:39   22363 be/4 root     1935.16 K/s    0.00 B/s  0.00 % 99.30 % sshd 
b'08:28:39   21517 be/4 root     1139.24 K/s    0.00 B/s  0.00 % 99.18 % sssd_nss --uid 0 --gid 0 --logger=files'
b'08:28:39    2339 be/4 root        5.68 M/s    0.00 B/s  0.00 % 99.08 % dockerd -H fd:// --containerd=/run/containerd/containerd.sock'
b'08:28:39    1454 be/4 root        5.28 M/s    0.00 B/s  0.00 % 98.84 % dockerd -H fd:// --containerd=/run/containerd/containerd.sock'
b'08:28:39    3366 be/4 root        7.70 M/s    0.00 B/s  0.00 % 98.83 % traefik traefik --providers.file.directory=/storage/config --providers.file.watch=true --providers.docker=true --providers.docker.exposedByDefault=false --providers.docker.constraints=Label(`traefik.constraint-label-stack`,`appwrite`) --entrypoints.appwrite_web.address=:80 --entrypoints.appwrite_websecure.address=:443'
b'08:28:39    1419 be/4 root        3.47 M/s    0.00 B/s  0.00 % 98.01 % containerd'
b'08:28:39    1023 be/4 root        4.89 M/s    0.00 B/s  0.00 % 97.81 % aliyun-service'
b'08:28:39    2947 be/4 root        5.90 M/s    0.00 B/s  0.00 % 97.49 % php app/http.php'
b'08:28:39    1019 be/4 root        4.68 M/s    0.00 B/s  0.00 % 96.64 % aliyun-service'
b'08:28:39   21507 be/4 root        5.65 M/s    0.00 B/s  0.00 % 89.20 % docker ps --all --no-trunc --format id={{.ID}}&name={{.Names}}&status={{.Status}}&labels={{.Labels}} --filter label=openruntimes-executor=appwrite-executor'
b'08:28:39    1155 be/2 root     1416.91 K/s    0.00 B/s  0.00 % 86.42 % AliYunDunMonitor'
b'08:28:39   21509 be/4 root        5.30 M/s    0.00 B/s  0.00 % 85.71 % docker ps --all --no-trunc --format id={{.ID}}&name={{.Names}}&status={{.Status}}&labels={{.Labels}} --filter label=openruntimes-executor=appwrite-executor'
b'08:28:39     898 be/4 root      319.20 K/s    0.00 B/s  0.00 % 84.38 % AliYunDunUpdate'
b'08:28:39    1840 be/4 root     1943.87 K/s    0.00 B/s  0.00 % 83.47 % containerd'
b'08:28:39    3549 be/4 systemd-    4.11 M/s    0.00 B/s  0.00 % 83.35 % mysqld --innodb-flush-method=fsync'
b'08:28:39    3547 be/4 systemd-    4.06 M/s    0.00 B/s  0.00 % 83.29 % mysqld --innodb-flush-method=fsync'
b'08:28:39    1159 be/2 root     1619.47 K/s    0.00 B/s  0.00 % 77.90 % AliYunDunMonitor'
b'08:28:39    1384 be/4 root        2.20 M/s    2.43 K/s  0.00 % 77.71 % platform-python -s /usr/sbin/iotop -d 10 -b -t'
b'08:28:39    1151 be/2 root     1119.64 K/s    0.00 B/s  0.00 % 70.47 % AliYunDunMonitor'
b'08:28:39    1146 be/2 root      923.45 K/s    0.00 B/s  0.00 % 67.66 % AliYunDun'
b'08:28:39    2761 be/4 root      886.10 K/s    0.00 B/s  0.00 % 67.50 % containerd-shim-runc-v2 -namespace moby -id 9fac24d87c9547133db82e3109d50660cdc3f156cc181447c7e778888f809f6d -address /run/containerd/containerd.sock'
b'08:28:39    3418 be/4 root        6.23 M/s    0.00 B/s  0.00 % 64.25 % node src/main.js'
b'08:28:39    2765 be/4 root      781.01 K/s    0.00 B/s  0.00 % 63.00 % containerd-shim-runc-v2 -namespace moby -id 9fac24d87c9547133db82e3109d50660cdc3f156cc181447c7e778888f809f6d -address /run/containerd/containerd.sock'
b'08:28:39    2762 be/4 root      541.78 K/s    0.00 B/s  0.00 % 58.47 % containerd-shim-runc-v2 -namespace moby -id 9fac24d87c9547133db82e3109d50660cdc3f156cc181447c7e778888f809f6d -address /run/containerd/containerd.sock'
b'08:28:39    2630 be/4 systemd-    2.26 M/s    0.00 B/s  0.00 % 50.79 % redis-server *:6379'
b'08:28:39     885 be/4 root      138.42 K/s    0.00 B/s  0.00 % 45.27 % AliYunDunUpdate'
b'08:28:39    1176 be/2 root      654.24 K/s    0.00 B/s  0.00 % 43.04 % AliYunDun'
b'08:28:39    3324 be/4 root     1929.71 K/s    0.00 B/s  0.00 % 41.93 % php /usr/src/code/app/realtime.php'
b'08:28:39       1 be/4 root      179.28 K/s    0.00 B/s  0.00 % 34.32 % systemd --switched-root --system --deserialize 17'
b'08:28:39    1171 be/2 root      624.01 K/s    0.00 B/s  0.00 % 31.60 % AliYunDunMonitor'
b'08:28:39    3334 be/4 root      279.43 K/s    0.00 B/s  0.00 % 31.50 % php /usr/src/code/app/realtime.php'
b'08:28:39    3333 be/4 root      378.16 K/s    0.00 B/s  0.00 % 31.33 % php /usr/src/code/app/realtime.php'
b'08:28:39    3331 be/4 root      244.60 K/s    0.00 B/s  0.00 % 31.11 % php /usr/src/code/app/realtime.php'
b'08:28:39    3326 be/4 root      233.88 K/s    0.00 B/s  0.00 % 31.11 % php /usr/src/code/app/realtime.php'

```


## parse-server
&emsp;上网重新搜了一下，发现parse-server的性能占用还是低，对于小访问量的小应用，我的轻量云完成可以，所以又折腾[parse-server](https://github.com/parse-community/parse-server)了。

&emsp;安装nodejs:
https://nodejs.org/en/download/package-manager
```cmd
# installs NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# download and install Node.js
nvm install 20
# verifies the right Node.js version is in the environment
node -v # should print `v20.12.2`
# verifies the right NPM version is in the environment
npm -v # should print `10.5.0`
```

&emsp;安装mongodb，安装时发现验证文件总下载失败404，切换成国内镜像也没成功，所以我试了一下参考国内镜像的写法，将gpgcheck设为0，删除gpgkey不进行验证，最终安装成功:
https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/

```cmd
vi /etc/yum.repos.d/mongodb-org-7.0.repo
// 添加源
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/8/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc

// 验证文件下载不正常，所以修改成不验证
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/8/mongodb-org/7.0/x86_64/
gpgcheck=0
enabled=1

// 更新yum缓存再安装
yum makecache
sudo yum install -y mongodb-org

sudo systemctl start mongod

```
&emsp;安装[parse-server](https://github.com/parse-community/parse-server)与[parse-dashboard](https://github.com/parse-community/parse-dashboard)
```
npm install -g parse-server mongodb-runner
npm install -g parse-dashboard


mongodb-runner start
// 弹出信息
Server started and running at mongodb://127.0.0.1:36697/
Run the following command to stop the instance:
mongodb-runner stop --id=dc149a73-a37e-44a2-a656-5c8ec6062c67

// 没想到是另起mongodb，之前安装mongod是用systemctl启动的，要停止它。
sudo systemctl stop mongod

// parse-server --appId APPLICATION_ID --masterKey MASTER_KEY --databaseURI mongodb://localhost/test

parse-server --appId appid-test-1234 --masterKey master-key-test-1234 --readOnlyMasterKey read-only-master-key-test-1234 --databaseURI mongodb://127.0.0.1:36697/test

// dashboard部署需要帐号密码与HTTPS，也可以通过readOnlyMasterKey来直接访问，如果填了masterKey会提示验证失败。
parse-dashboard --dev --appId appid-test-1234 --masterKey read-only-master-key-test-1234 --serverURL "http://1.2.3.4:1337/parse" --appName test-parse-dashboard

// 失败了几次后，最终测试成功，能打开网址

```

但是，我看到那只是测试，正式使用还是要https，访问parse-dashboard还是需要帐号密码登陆的，所以继续折腾：

但打开会发现需要HTTPS才能访问，搞个内网IP HTTPS证书试一下，[zerossl创建IP地址的https证书](https://blog.csdn.net/easylife206/article/details/124642123)，测试[zerossl](https://zerossl.com/)没问题，并使用nginx部署。nginx部署时我犯了错误，额外添加了add-header Access-Control-Allow-Origin，导致一直报跨域错误并提示`Access-Control-Allow-Origin`只允许一个值（没细看，导致瞎折腾很久）。nginx配置供大家参考：

```
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  _;
        root         /root/frontend/;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }

# Settings for a TLS enabled server.

   server {
       listen       443 ssl http2 default_server;
       listen       [::]:443 ssl http2 default_server;
       server_name  _;
       #root         /root/frontend/;

       ssl_certificate "/etc/pki/nginx/certificate.crt";
       ssl_certificate_key "/etc/pki/nginx/private.key";
       ssl_session_cache shared:SSL:1m;
       ssl_session_timeout  10m;
       ssl_ciphers PROFILE=SYSTEM;
       ssl_prefer_server_ciphers on;

       # Load configuration files for the default server block.
       include /etc/nginx/default.d/*.conf;

       location / {
            proxy_pass http://127.0.0.1:4040;
       }

       error_page 404 /404.html;
           location = /40x.html {
       }

       error_page 500 502 503 504 /50x.html;
           location = /50x.html {
       }
   }


   server {
       listen       1338 ssl http2 default_server;
       listen       [::]:1338 ssl http2 default_server;
       server_name  _;
       #root         /root/frontend/;

       ssl_certificate "/etc/pki/nginx/certificate.crt";
       ssl_certificate_key "/etc/pki/nginx/private.key";
       ssl_session_cache shared:SSL:1m;
       ssl_session_timeout  10m;
       ssl_ciphers PROFILE=SYSTEM;
       ssl_prefer_server_ciphers on;

       # Load configuration files for the default server block.
       include /etc/nginx/default.d/*.conf;

       location / {
            proxy_pass http://127.0.0.1:1337;
       }

       error_page 404 /404.html;
           location = /40x.html {
       }

       error_page 500 502 503 504 /50x.html;
           location = /50x.html {
       }
   }
}
```
&emsp;创建配置文件再运行`parse-server parse-server-configuration.json`


```json
{
    "appId":"appid-test-1234",
    "masterKey":"master-key-test-1234",
    "readOnlyMasterKey":"read-only-master-key-test-1234",
    "databaseURI":"mongodb://127.0.0.1:36697/test"
}
```

&emsp;创建配置文件再运行`parse-dashboard --config parse-dashboard-config.json`：

```json
{
  "apps": [
    {
      "serverURL": "https://1.2.3.4:1338/parse",
      "appId": "appid-test-1234",
      "masterKey": "master-key-test-1234",
      "readOnlyMasterKey":"read-only-master-key-test-1234",
      "appName": "test-parse-dashboard"
    }
  ],
    "users": [
        {
          "user":"t123456",
          "pass":"test123456"
        }
    ],
    "trustProxy": 1,
    "useEncryptedPasswords": false
}

```



&emsp;折腾了大半天，能在parse-dashboard插入数据，前期的部署测试最终完成。

## 附录
- [parse-server-example](https://github.com/parse-community/parse-server-example)
- [Parse Server JavaScript中文指南](https://parse-zh.buzhundong.com/Files.html)