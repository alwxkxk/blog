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
## 本篇学习内容
- 简单了解一下TCP协议
- 使用网络调试助手模拟服务器端与客户端，进行相互通信
- 使用网络调试助手模拟服务器端，NodeMCU当客户端，控制开关灯


## 简单了解一下TCP协议
&emsp;我们常常把一个复杂的问题分解成若干个相对简单的问题，然后再一个个解决。计算机网络是一个复杂的系统，所以使用分层来简化，各层各自负责自己的事：
![TCP/IP协议模型](/blog_images/005BIQVbgy1fvi66culs3j30if0d674z.jpg)
&emsp;整个网络通信模型如上图所示：网络通信时可以大概划分成四层，上层依赖于下层。从下往上看，由第一层（链路层）解决通信时数据传输问题（它负责两个设备之间数据传输，可以理解为两台设备用网卡跟网线连接起来，能传输数据了）。由第二层（网络层）解决网络通信时的寻址问题（将数据设法从源端经过若干个中间节点传送到目的端，提供最基本的端到端的数据传送服务）。由第三层（传输层）解决程序间的通信问题（端口号区分程序就是在这一层）。第四层才是具体应用的数据通信问题（提供特定的应用服务）。
&emsp;在具体的通信协议上，硬件与服务器之间的通信协议，我们使用了TCP(（Transmission Control Protocol，传输控制协议）)。
&emsp;TCP位于第三层，基于IP协议来实现。与TCP同属第三层的UDP（User Datagram Protocol，用户数据报协议）属于无连接的不可靠传输通信协议，需要写额外的代码来处理很多杂事，所以不用，这里不细讲，想深入学习请看《TCP/IP详解 卷一》。

## 使用网络调试助手相互通信
&emsp;

## 网络调试助手与NodeMCU通信
&emsp;

### TCP通信-demo1
&emsp;注意修改WIFI地址与密码。
&emsp;__特别注意：NodeMCU分V2与V3版本，两者略有不同，其中V3的LED引脚略有不同，写代码需要另外定义引脚:__`#define LED_BUILTIN 2`
&emsp;有网友问到，WIFI连接成功了，但提示连接失败，这个IP地址是需要填什么？ IP地址是需要填写TCP服务端的IP址，前期调试可以使用网络调试助手来充当TCP服务端：
![物联网项目](/blog_images/nodemcu与网络调试助手联调.jpg)

```c
//如果是NodeMCU V3版，需要另外定义LED引脚
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
    Serial.println("host connected!");
    //发送第一条TCP数据，发送ID号
    client.print(id);
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
      // 有网友反应，使用client.read()速度会更快。我没实践过。
      String line = client.readStringUntil('\n');
      if (line == "1") {
        Serial.println("command:open led.");
        digitalWrite(LED_BUILTIN, LOW);
        client.print("OK");
      }
      else if (line == "0") {
        Serial.println("command:close led.");
        digitalWrite(LED_BUILTIN, HIGH);
        client.print("OK");
      }
    }
    else {
      //若没收到TCP数据，每隔一段时间打印并发送tick值
      Serial.print("tick:");
      Serial.println(tick);
      client.print(tick);
      tick++;
      delay(1000);
    }
  }

}
```