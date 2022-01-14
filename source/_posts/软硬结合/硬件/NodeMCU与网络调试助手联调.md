---
title: NodeMCU与网络调试助手联调
toc: true
abbrlink: 7602
date: 2021-07-25 09:41:49
tags:
---


&emsp;在阅读本篇文章之前，你已经阅读了：
- [软硬结合-导读](/posts/44755)
- [NodeMCU基础](/posts/31494)
- [demo1跑起来](/posts/64786/)
- [demo2跑起来](/posts/64786/)
- [部署到云服务器](/posts/31687/)
- [计算机网络基础](/posts/37707)

&emsp;在第二节课[NodeMCU基础](/posts/31494)里，跑了几个例程来验证了硬件没问题，初步实践了如何控制开关灯，如何串口打印调试信息等等。上一节[计算机网络基础](/posts/37707)已经学习到，程序之间的网络通信是需要IP地址与端口号。现在我们还没学习到如何开发对应的软件（服务器端与用户操作界面），但是我们已经迫不急待地想通过网络通信，控制NodeMCU开关灯来进行验证想法，所以我们将在这节使用网络调试助手来 __等效替换__ 端服务器端与用户操作界面。__等效替换__ 的思想将会反复出现，因为它是调试、验证的最佳手段。

![降低门框](/blog_images/降低门框.webp)

## 本篇学习内容
- 简单了解一下TCP协议
- 使用网络调试助手模拟服务器端与客户端，进行相互通信
- 使用网络调试助手模拟服务器端，NodeMCU当客户端，控制开关灯

## 本篇视频

<iframe src="//player.bilibili.com/player.html?aid=462062924&bvid=BV16L411n7Pi&cid=379908862&page=7" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

## 简单了解一下TCP协议
&emsp;我们常常把一个复杂的问题分解成若干个相对简单的问题，然后再一个个解决。计算机网络是一个复杂的系统，所以使用分层来简化，各层各自负责自己的事：
![TCP/IP协议模型](/blog_images/TCP-IP协议模型.webp)
&emsp;整个网络通信模型如上图所示：网络通信时可以大概划分成四层，上层依赖于下层。从下往上看，由第一层（链路层）解决通信时数据传输问题（它负责两个设备之间数据传输，可以理解为两台设备用网卡跟网线连接起来，能传输数据了）。由第二层（网络层）解决网络通信时的寻址问题（将数据设法从源端经过若干个中间节点传送到目的端，提供最基本的端到端的数据传送服务）。由第三层（传输层）解决程序间的通信问题（端口号区分程序就是在这一层）。第四层才是具体应用的数据通信问题（提供特定的应用服务）。
&emsp;在具体的通信协议上，硬件与服务器之间的通信协议，我们使用了TCP(（Transmission Control Protocol，传输控制协议）)。
&emsp;TCP位于第三层，基于IP协议来实现。与TCP同属第三层的UDP（User Datagram Protocol，用户数据报协议）属于无连接的不可靠传输通信协议，需要写额外的代码来处理很多杂事，所以不用UDP，这里不细讲，想深入学习请看[《TCP/IP详解 卷一》[(在线版)](http://www.52im.net/topic-tcpipvol1.html?mobile=no)。

## 使用网络调试助手相互通信
&emsp;我们之前在[NodeMCU基础](/posts/31494)就使用过[网络调试助手](https://pan.baidu.com/s/1XBpeUK9QcA0r90yZkIe6fg)来跟NodeMCU联调，这里我们再加深了解一下。一家医院可以同时接待多个病人，同理，__一个服务器端可以同时服务多个客户端__。我们简单地使用网络调试助手建一个服务器端，两个客户端简单地通信一下，具体操作祥看本篇演示视频。上一节[计算机网络基础](/posts/37707)说过了，服务器端的IP地址填`0.0.0.0`，客户端的地址填服务器端的地址，由于网络调试助手就在本机上运行，服务器端也是在本地，所以充当客户端的IP地址可以填写`127.0.0.1`来指向本地。
&emsp;额外补充一下，一个服务器端并不能同时服务无数个客户端，它是有限制的，系统本身有个最大连接的限制（印象中好像可以设置调大调小，但也不是无限大），服务器本身性能的限制（太多了响应不过来就卡住了），网络带宽的限制（传输太多了达到网络带宽的上限都堵塞住了）等等诸多因素共同限制。当达到这种瓶颈问题，一般的作法是在预算范围内先优化好单台服务器的各项瓶颈，但是单台服务器的性能始终是有极限的，不断地提升会导致费用呈指数性上升，所以后面就是多台服务器一起处理（横向扩展费用相对便宜很多）。

## 网络调试助手控制NodeMCU开关灯
&emsp;（PS：虽然大家在前面几节已经通过我的demo来看到最终效果，但那是为了让大家先拥有，证明此项目可行，好有信心学下去。实际上当我们实践时，我们是不断地一步步探索验证前进。）
&emsp;在我们的设想中，我们是要让NodeMCU与服务器端程序通信，服务器端程序接收来自于NodeMCU的数据以及向NodeMCU发送控制命令控制开关灯。然而，我们还没学会如何写服务器端程序，但已经迫不急待地想验证，所以我们使用网络调试助手来 __等效替换__ 我的服务器端程序，进行前期的想法验证，探索验证通过网络通信确实能控制NodeMCU。

&emsp;先简单补充一下LED灯的工作原理：如下图所示，LED中文是发光二极管，施加正向电压时电流从LED阳极流向阴极并发光。（反向电压无法通过电流）
![LED原理图1](/blog_images/LED原理图1.webp)

&emsp;在电路中，限流电阻的作用是降低电流防止电流过大把LED给烧了。把单片机连接LED灯的引脚设置为低电平，造成电压差，就可以实现开灯的效果。同理，设置为高电平，没有电压差，最终关灯。


```c
//如果是nodemcu V3版，需要另外定义LED引脚
//#define LED_BUILTIN 2 
#include <ESP8266WiFi.h>
//必须修改：填写你的WIFI帐号密码
const char* ssid = "you-wifi";
const char* password = "you-wifi-password";

const char* host = "42.192.168.165";
const int port = 9002;//demo1 tcp 使用 9002端口

const char* id = "1234abcd";
int tick = 1000;

WiFiClient client;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
  //连接WIFI
  WiFi.begin(ssid, password);
  //设置读取socket数据时等待时间为100ms（默认值为1000ms，会显得硬件响应很慢）
  client.setTimeout(100);

  //等待WIFI连接成功
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi connecting...");
    delay(500);
  }
  Serial.println("WiFi connected!.");
}

void loop() {
  // put your main code here, to run repeatedly:
  if (client.connect(host, port))
  {
    // TCP连接成功
    Serial.println("host connected!");
    client.println("TCP client connected!");
  }
  else
  {
    // TCP连接异常
    Serial.println("host connecting...");
    delay(500);
  }

  while (client.connected()) {
    //      接收到TCP数据
    if (client.available())
    {
      String line = client.readStringUntil('\n');
      if (line == "1") {
        // 如果接收到1，就代表开灯
        Serial.println("command:open led.");
        // 设置该引脚为低电平
        digitalWrite(LED_BUILTIN, LOW);
        client.println("OK");
      }
      else if (line == "0") {
        // 如果接收到0，就代表关灯
        Serial.println("command:close led.");
        // 设置该引脚为高电平
        digitalWrite(LED_BUILTIN, HIGH);
        client.print("OK");
      }else{
        Serial.print("receive:"); 
        Serial.println(line); 
      }
    }
  }
}

```







