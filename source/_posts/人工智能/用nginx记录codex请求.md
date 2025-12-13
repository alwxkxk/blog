---
title: 用nginx记录codex请求
toc: true
abbrlink: 17417
date: 2025-12-13 17:00:19
tags:
img: /blog_images/AI/使用AI工具.webp
---


## nginx转发配置
&emsp;在使用AI工具时，不管是codex还是cherry studio，都发现当接口异常时都因无法从日志里找到URL而难以分析。经过各种折腾，才想起nginx转发功能。将7171端口转发至openrouter，配置如下：

```nginx.conf
http {
	# 在 http 块中定义自定义日志格式
    log_format postdata escape=json '$remote_addr - $remote_user [$time_local] '
                '"$request" $status $body_bytes_sent '
                '"$http_referer" "$http_user_agent" '
                '$request_time req_body:"$request_body"';

    # openrouter 转发
    server {
        listen 7171;
        server_name _;
        access_log logs/openrouter_access.log postdata;
        error_log logs/openrouter_error.log debug;  # 启用详细错误日志
        # 宽松的 SSL 设置（用于调试）
        proxy_ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
        proxy_ssl_ciphers ALL;
        proxy_ssl_verify off;
        proxy_ssl_verify_depth 3;
        proxy_ssl_server_name on;
        proxy_ssl_name openrouter.ai;
        # 代理超时设置
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        proxy_next_upstream error timeout http_500 http_502 http_503 http_504;
        proxy_next_upstream_tries 3;
        location / {
            proxy_pass https://openrouter.ai;
            
            proxy_set_header Host openrouter.ai;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header User-Agent $http_user_agent;
            
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            
            proxy_hide_header X-Powered-By;
            proxy_hide_header Server;
            
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Origin, Authorization, Content-Type, X-Requested-With";
            
            if ($request_method = 'OPTIONS') {
                add_header Access-Control-Max-Age 1728000;
                add_header Content-Type 'text/plain charset=UTF-8';
                add_header Content-Length 0;
                return 204;
            }
        }
    }
}
```

## 通过转发日志定位发现的问题
&emsp;当发现异常时，就把base url指向`http://127.0.0.1:7171`，查看日志（正常时改回官方url,避免日志生成。）

### response时的header重复
&emsp;查看发现error.log里有，就定位出多了header重复了：
```
2025/12/09 16:32:39 [info] 18946#0: *32 client sent duplicate header line: 
"Authorization: Bearer sk-or-v1-xxxxxxx", previous value: 
"Authorization: Bearer sk-or-v1-xxxxxxx" while reading client request headers, 
client: 127.0.0.1,server: _, request: "POST /api/v1/responses HTTP/1.1", host: "127.0.0.1:7171"
```
&emsp;其实我就发现，codex在chat模式下需要`"Authorization: Bearer sk-or-v1-xxxxxxx"`,但是在使用过程中，切换常忘记，有日志定位就容易发现。

### 无法阅读文件的原因
&emsp;codex发现能聊天，但一读文件就报错，在access.log定位到：
```
"type": "function_call_output",
  "call_id": "call_93caa17cd376474ba142a380",
  "output": "failed to parse function arguments: Error(\"EOF while parsing a value\", line: 1, column: 0)",
```
&emsp;就猜到是大模型阅读文件异常，后续添加MCP找到[desktop-commander](https://github.com/wonderwhy-er/DesktopCommanderMCP),就正常了。

## 其它
### 清空日志脚本
&emsp;mac oc写一个sh脚本 clear.sh，清空log，随时清空旧日志，方便定位。

```sh
#!/bin/bash
# 清空当前目录下所有 .log 文件的内容
for logfile in *.log; do
    if [[ -f "$logfile" ]]; then
        truncate -s 0 "$logfile"
        echo "已清空: $logfile"
    fi
done
echo "完成：所有 .log 文件已清空。"
```
&emsp;给权限`chmod +x clear.sh`， 运行`./clear.sh`。




