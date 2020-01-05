---
title: MQTT协议基础
toc: true
abbrlink: 20945
date: 2018-12-14 19:39:28
tags:
- MQTT
---

&emsp;有读者问我MQTT相关问题，我搜索MQTT教程竟然没发现比较好的教程，想偷懒都不行，只能自己写详细点了。
&emsp;MQTT是基于发布/订阅范式（后面亲自跟着实际操作后就会明白什么是发布/订阅）的消息协议。
&emsp;Eclipse基金会开源的MQTT网关[mosquitto](https://mosquitto.org/)，[mqttfx](https://mqttfx.jensd.de/index.php)是开源的MQTT客户端（[mqttfx-1.6.0-windows-x64-百度网盘](https://pan.baidu.com/s/19yiEDjpLCpS_2Yew_4GcKA)）
[mosquitto网关官方在线测试网址](https://test.mosquitto.org/)：`https://test.mosquitto.org/`。下面我会同时打开三个客户端ABC连接到mosquitto网关，A发布消息，BC分别订阅不同的主题：
<img alt="MQTT订阅" src="/blog_images/005BIQVbgy1fyb4eozcg9j30pd0i63z4.jpg" style="width:500px;height:400px;">
&emsp;安装客户端mqttfx后，打开设置，配置MQTT网关地址，MQTT端口号默认使用1883，注意要自动生成一个客户端ID。然后保存，建立连接。服务器在国外，连接可能有点慢。
![](/blog_images/005BIQVbgy1fyb4omlaknj30zr0m2t9v.jpg)
![](/blog_images/005BIQVbgy1fyb4u8w5e5j30sw0kxjsm.jpg)
![](/blog_images/005BIQVbgy1fyb4sbqm1rj30zr0m23zn.jpg)

&emsp;打开三个客户端并连接后，让BC分别订阅主题`a/b`、`a/c`，然后让A分别发布主题`a/b`、`a/c`,可以看到客户端BC分别接收到消息。__其实一个客户端能同时订阅多个主题，并进行发布，这里只是为了方便展示而开了三个。大家实际操作时可以只开一个客户端，订阅主题，然后回到发布窗口发布消息，再回到订阅窗口看是否接收到消息__。大家亲自操作一次验证一下。
![](/blog_images/005BIQVbgy1fyb560jei2j31be0qpqn1.jpg)
![](/blog_images/005BIQVbgy1fyb567papmj31bx0qu1ds.jpg)
![](/blog_images/005BIQVbgy1fyb56d6l9yj31bj0qqnhl.jpg)

## MQTT消息
&emsp;通过以上操作，相信大家已经明白什么叫发布/订阅（如果还不太懂就多搜索再看一下其它文章继续学习）。MQTT所发的消息包含：主题+内容，客户端订阅可以任意主题，若有其它客户端发布主题时符合所订阅的主题，就会由网关发送到客户端。注意整个操作中，网关是没有对消息做任何修改的，只是负责管理复制消息转发给已经订阅主题的客户端。主题使用`/`是层次分隔符，可以使主题变得更多层次。
&emsp;客户端在订阅时所输入的是“主题过滤器”，是允许使用通配符（wildcards）进行订阅。

- `+`是单级通配符，可以放任意层次位置。
如订阅`“sport/tennis/+`，则会订阅到如`sport/tennis/player1`、`sport/tennis/player2`等，但不会订阅到`sport/tennis/player1/ranking`
如订阅`a/+/c`，能订阅到`a/b/c`、`a/abc/c`等消息。

- `#`是多级通配符，只能放末尾。
如订阅`#`，则会接收到所有消息。（除了以`$`开头的主题）
如订阅`sport/tennis/player1/#`，则会订阅到如`sport/tennis/player1`、`sport/tennis/player1/ranking`、`sport/tennis/player1/score/wimbledon`等。

&emsp;另外注意，MQTT所发的消息是UTF-8，所以说那你想发个字符串`AA`那是随便发，但想发`0xAA`这种十六进制的，还真可能发不了，因为`0xAA`转不成UTF-8。（之前有个读者问我相关问题，我简单研究了一下，没有投太多时间深入研究，如果是错的欢迎指正。）

## MQTT其它特性
### 服务级别
&emsp;服务级别（Quality of Service，简写QoS）提供三种，供开发者根据不同的情景选择不同的服务级别：
- QoS 0
- QoS 1
- QoS 2

&emsp;QoS 0代表最多发送一次，最简单最省流量。QoS 1至少发送接收到一次（即有可能重复接收到多次）。QoS 2保证只接收到一次，代价最大。
&emsp;消息可选择是否保留（retained），常用于传递代表状态的消息。某主题若被设置为retained，客户端订阅该主题时会马上接收到该retained消息。
&emsp;在实际生产环境，一般会使用国人开源的MQTT网关——[EMQTT](http://www.emqtt.com/)，它拥有更多的辅助功能。
### 遗言机制
&emsp;MQTT客户端连接MQTT网关时，可以注册遗言，当客户端断开连接时，MQTT网关会把这条遗言发布出来，常用于通知这个客户端下线了。

## 举列说明
&emsp;现在，我假设一套硬件（假设为设备ID为123456）与一个云服务器，如何让这套硬件的数据通过MQTT传输到云服务器中，并将数据保存到数据库里呢？
![](/blog_images/mqtt-example.png)
1. 在服务器上部署MQTT网关（比如说mosquitto、EMQTT），然后使用MQTT客户端连接网关，订阅主题与发布消息，验证服务可用。
2. 硬件代码引用MQTT库，使其能连接MQTT网关，订阅与发布消息，验证其MQTT通信正常。
3. 服务器端代码引用MQTT库，使其能连接MQTT网关，订阅与发布消息，验证其MQTT通信正常。
4. 设计相关业务与MQTT消息的主题与内容。（比如说 这套硬件上传温度数据：服务器端代码订阅所有主题消息`*`。硬件连接MQTT网关，发布MQTT消息，主题为`/equipment/123456`，内容为`{temperature:24}`，服务器端代码接收到这条消息，读取数据并保存到数据库。）

至于将数据保存到数据库，以及在网页上显示出数据内容，那是Web开发的内容，查看其它文章学习相关内容，不再复述。

<!-- ## 基于MQTT协议通信设计
&emsp;为了不让这篇文章太长，另开文章讨论如何基于MQTT协议设计自己的通信协议：[基于MQTT协议的通信设计](/posts/31151/) -->

## 附录
- [MQTT规范文档 Version 3.1.1](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html)
- [十六进制转UTF-8 在线转换工具](https://onlinehextools.com/convert-hex-to-utf8)