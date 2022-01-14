---
title: 部署parse dashboard 的问题排查记录
toc: true
tags:
  - parse server
  - Nginx
  - parse dashboard
abbrlink: 27777
date: 2019-09-22 20:23:16
---



&emsp;申请了HTPPS证书后，使用Nginx反向代理parse server与parse dashboard，parse dashboard按照[文档](https://github.com/parse-community/parse-dashboard)配置了`parse-dashboard-config.json`,发现登陆parse dashboard成功后，仍然显示为无应用数据。在之前测试国，dashboard使用dev模式时，免账号密码登陆时是能正常显示应用数据，所以判断应该是某个环节出了问题所导致了。使用开发者工具打开控制台，报出了一条错误：`[Error](https://parse.scaugreen.cn/parse-dashboard-config.json 404 (Not Found))`，很显然是由于无法正常读取`parse-dashboard-config.json`所导致的问题。
&emsp;当时我的`Nginx.conf`配置如下：
```conf
  server {
    listen 443;
    server_name parse.scaugreen.cn;
    # 访问记录，mylog是我自定义的日志格式。
    access_log /var/log/Nginx/parse.log mylog;
    ssl on;
    ssl_certificate 1_parse.scaugreen.cn_bundle.crt;
    ssl_certificate_key 2_parse.scaugreen.cn.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2; 
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;

    # parse-dashboard
    location / {
      proxy_pass http://localhost:4040;
    }

    # parse-server
    location /parse {
      proxy_pass http://localhost:1337/parse;
    }

    # WebSocket 配置
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
  }

```

&emsp;问题的结论就是`GET /parse-dashboard-config.json`并不是重定向到 parse dashboard（对应location / 块）的`http://localhost:4040/parse-dashboard-config.json`，而是配对到了parse server（对应 location /parse 块）变成了`http://localhost:1337/parse-dashboard-config.json`。 当时这个问题我并没能直接意识到问题所在，一直怀疑是我配置出了什么问题，所以卡了我很久时间才找到原因的，下面记录一下解决办法与排查过程。

## 解决办法
&emsp;解决办法就是，修正指向，只需要添加以下配置即可：
```conf
  location = /parse-dashboard-config.json{
    proxy_pass http://localhost:4040/parse-dashboard-config.json;
  }
```
&emsp;这样，`GET /parse-dashboard-config.json`就能正确指向`http://localhost:4040/parse-dashboard-config.json`。
&emsp;另外，解决完这个问题后，登陆成功后马上变白屏，连界面都无法显示出来，控制台打印提示：`dashboard.bundle.js:102 Missing push locales for 'personal-project-manager', see this link for details on setting localizations up. https://github.com/parse-community/parse-dashboard#configuring-localized-push-notifications`，搜了一下，只需要在在`parse-dashboard-config.json`添加`"supportedPushLocales": []`即可解决。至此，所有问题解决完毕。

## 排查过程
&emsp;google跟在issue上找了很久，各种折腾配置，都没解决问题。
&emsp;首先，我手动将`parse-dashboard-config.json`配置成静态文件，让Nginx直接代理，这时`GET /parse-dashboard-config.json`是能直接取到文件，而dashboard也能正常地将应用数据展示出来。但是这样的话，就相当于泄漏了masterKey，这是不正确的做法，但这步验证基本能证明是解决了这个404问题就能正常显示应用数据。
&emsp;接着，我手动修改了parse dashboard代码，在关键的地方console打印出数据来，发现`GET /parse-dashboard-config.json`根本就没进入到应用代码中。至此验证了是Nginx问题，并没有将请求正确地重定向到应用服务。
&emsp;最后，我开始研究如何排查Nginx了，google了一下，最佳的问题是使用Nginx的debug模式，将debug信息打印到日志里，一目了然。（参考[nginx最好的debug方式是什么？ - 知乎](https://www.zhihu.com/question/30255532)）Nginx的debug模式要求编译时就要带 `--with-debug`参数，可以使用命令` nginx -V 2>&1 | grep -- '--with-debug'` ，如果有打印出相关信息来说明编译里已经带了，可以正常使用。在Nginx配置里添加配置：
```conf
server{
   server_name example.com
   error_log /path/to/errorlog/error.log debug;
}
```

&emsp;使用`tail -f error.log` 查看日志，再次`GET /parse-dashboard-config.json`时，其日志关键内容如下所示：
```log
...
2019/09/22 16:46:36 [debug] 6625#6625: *963913 http process request line
2019/09/22 16:46:36 [debug] 6625#6625: *963913 http request line: "GET /parse-dashboard-config.json HTTP/1.1"
2019/09/22 16:46:36 [debug] 6625#6625: *963913 http uri: "/parse-dashboard-config.json"
2019/09/22 16:46:36 [debug] 6625#6625: *963913 http args: ""
2019/09/22 16:46:36 [debug] 6625#6625: *963913 http exten: "json"
2019/09/22 16:46:36 [debug] 6625#6625: *963913 http process request header line
2019/09/22 16:46:36 [debug] 6625#6625: *963913 http header: "Host: parse.scaugreen.cn"
2019/09/22 16:46:36 [debug] 6625#6625: *963913 http header: "Connection: keep-alive"
...
2019/09/22 16:46:36 [debug] 6625#6625: *963913 test location: "/"
2019/09/22 16:46:36 [debug] 6625#6625: *963913 test location: "parse"
2019/09/22 16:46:36 [debug] 6625#6625: *963913 using configuration "/parse"
...
```

&emsp;分析:`GET /parse-dashboard-config.json`使用 /parse 这个location 区的配置，这说明重指向错误了。最后添加配置修正配置即解决问题，问题的根源在于我没有意识到/parse-dashboard-config.json 是匹配到  /parse location里，而我一直误以为是配置到 / location里（本质是因为对Nginx location配置还没有真正理解，进而才能正确使用）。

## 附录
- [nginx最好的debug方式是什么？ - 知乎](https://www.zhihu.com/question/30255532)
