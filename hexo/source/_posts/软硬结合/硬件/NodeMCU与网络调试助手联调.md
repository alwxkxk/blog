---
title: NodeMCU与网络调试助手联调
toc: true
abbrlink: 7602
date: 2021-07-25 09:41:49
tags:
---



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