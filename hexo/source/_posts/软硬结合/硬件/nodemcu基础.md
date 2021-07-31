---
title: NodeMCU基础
toc: true
abbrlink: 31494
date: 2018-10-13 17:05:22
tags:
- Arduino
- ESP8266
- NodeMCU
---

&emsp;在阅读本篇文章之前，你已经阅读了：
- [软硬结合-导读](/posts/44755)
## 本篇学习内容
- 认识、购买NodeMCU开发板
- 安装Arduino IDE、ESP8266扩展开发板
- 实现NodeMCU开发板LED灯闪烁例子
- 实现NodeMCU开发板串口通信的例子

## 本篇视频
<iframe src="//player.bilibili.com/player.html?aid=462062924&bvid=BV16L411n7Pi&cid=379908862&page=2" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

## NodeMCU简介
![ESP8266芯片模块开发板的区别](/blog_images/ESP8266芯片模块开发板的区别.jpg)
&emsp;NodeMCU本质就是把ESP8266的引脚都引出来，配合USB转串口芯片，使其能快速开发验证想法。
&emsp;在我的毕业设计里，ESP8266模块只是充当WIFI通信模块的作用，只做消息转发不做业务处理，传感器与STM32通信，STM32再与ESP8266模块通信。而在这个教程里，使用NodeMCU，省去了STM32这个中间商，传感器与STP8266直接相连，此时ESP8266芯片既是WIFI通信芯片，也做业务处理。NodeMCU的引脚如下：

![NodeMCU引脚图](/blog_images/005BIQVbgy1fw7hir4bdrj30si0fuwmo.jpg)
&emsp;淘宝价大约在十几块钱，如果是第一次玩硬件，自己没有USB线的话，记得还要额外买 __一条线__ ：

<img alt="淘宝NodeMCU" src="/blog_images/005BIQVbgy1fyy8y8neuij30rw0dbtfj.jpg" style="cursor:pointer;">

&emsp;先买一块NodeMCU（超便宜的，最便宜十几块钱就能在淘宝上买到）,安装驱动精灵（用于安装串口驱动的），安装Arduino-1.8版本以上[Arduino1.8.7（百度网盘）](https://pan.baidu.com/s/1E6wDSEYoeDoAm9GhUGwdaw)

&emsp;特别注意：NodeMCU分V2与V3版本（非官方承认），两者略有不同，其中V3略便宜且LED引脚略有不同，写代码需要另外定义引脚:`#define LED_BUILTIN 2`。别问我买哪个版本的，__买便宜的那一个!!!（好像是V3便宜些）__
![](/blog_images/005BIQVbgy1fz9u3c3howj30my0bvdpc.jpg)

## 验证硬件是否正常
&emsp;把NodeMCU接上USB线插上电脑，如果发现没有识别到端口的话，可能是线有问题，也有可能是板子有问题。如果你怀疑是板子有问题，请联系客服要求换货。
&emsp;在演示时我的新电脑没有提示，如果需要安装串口驱动可看以下的视频。USB转串口芯片有些用cpXX，有些是CHxx，插上NodeMCU后让驱动精灵来安装对应驱动即可。

<iframe src="//player.bilibili.com/player.html?bvid=BV1JK4y1o7Nc&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>


## 使用Arduino编程
&emsp;这里演示一下开发环境的搭建以及最简demo。
### 搭建开发环境



&emsp;安装Arduino-1.8版本以上[Arduino1.8.7（百度网盘）](https://pan.baidu.com/s/1E6wDSEYoeDoAm9GhUGwdaw)(安装过程一直next就是，我就不录视频了)，配置ESP8266扩展开发板网址并安装SDK。（我已经配置并安装了，你们自行安装一下，安装过程可能会比较慢。）扩展开发板网址:`http://arduino.esp8266.com/stable/package_esp8266com_index.json`。但由于不可描述的原因，一般是安装失败的，可请看另一文章进行解决：[Arduino开发板管理安装失败解决办法](/posts/10960)。

![无法获取外面的资源](/blog_images/无法获取外面的资源.jpg)

&emsp;验证一下是否已经安装扩展SDK，如果烧录程序时提示`ESP8266WiFi.h:No such file or directory`，基本就代表没有安装或选择扩展。

<iframe src="//player.bilibili.com/player.html?bvid=BV1dp4y1t75w&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

&emsp;安装完扩展开发板信息后，记得选择开发板为`NodeMCU 1.0`。如果连接上开发板并可以看到开发板信息，说明连接正常，可以编程了。__拿到开发板的第一件事，就是跑个例程，证明硬件是没问题的。__ 我们接下来要做的事就是，通过代码把开发板上的LED闪烁起来，证明板子没问题。然后就是实践串口通信收发消息与验证连接WIFI的功能。
## 例程

### 控制LED
&emsp;NodeMCU板LED灯闪烁。
&emsp;__特别注意：NodeMCU分V2与V3版本，两者略有不同，其中V3的LED引脚略有不同，写代码需要另外定义引脚:`#define LED_BUILTIN 2`，即把第二行代码取消注释。__
```c
//如果是NodeMCU V3版，需要另外定义LED引脚
//#define LED_BUILTIN 2 
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);     // Initialize the LED_BUILTIN pin as an output
}

// the loop function runs over and over again forever
void loop() {
  digitalWrite(LED_BUILTIN, LOW);   // Turn the LED on (Note that LOW is the voltage level
  // but actually the LED is on; this is because
  // it is active low on the ESP-01)
  delay(1000);                      // Wait for a second
  digitalWrite(LED_BUILTIN, HIGH);  // Turn the LED off by making the voltage HIGH
  delay(2000);                      // Wait for two seconds (to demonstrate the active low LED)
}
```


### 串口通信
&emsp;展示一个定时串口打印信息的简单demo。**Arduino串口信息窗口：IDE菜单栏->工具->串口监视器。**
```c
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  delay(10);
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println("WiFi connected");
  delay(1000);
}
```

<iframe src="//player.bilibili.com/player.html?bvid=BV1c64y1U7Su&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>


### TCP通信-串口打印
&emsp;演示中使用到的[网络调试助手-百度网盘](https://pan.baidu.com/s/1XBpeUK9QcA0r90yZkIe6fg)，自行安装。
&emsp;注意根据实际情况 __修改WIFI的标识号与密码（第3、4行），与TCP服务器的IP地址、端口号（第6、7行）__ ，注意部分学校校园网是需要登陆学生帐号密码的，所以是用不了的，可以用手机发热点来代替。 演示中使用了网络调试助手开启了TCP服务器，`0.0.0.0`代表的是允许所有机器连接，如果`127.0.0.1`的话，则只允许本机的程序连接。`2424`端口对应着程序的代码端口。

```c
#include <ESP8266WiFi.h>
//必须修改：填写你的WIFI帐号密码
const char* ssid = "you-wifi";
const char* password = "you-wifi-password";

const char* host = "192.168.1.121";
const int port = 2424;

WiFiClient client;

void setup() {
  //初始化串口
  Serial.begin(115200);
  delay(10);

  // Connect to WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  //连接WIFI
  WiFi.begin(ssid, password);
  //等待WIFI连接成功
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

}

void loop() {
  //连接TCP服务器
  if (client.connect(host, port))
  {
    // 串口打印，连接成功
    Serial.println("client connected to the host");
    //发送TCP数据
    client.println("hello~");
  }
  else
  {
    // 串口打印，连接失败
    Serial.println("client connection failure");
  }

  while (client.connected())
  {
    delay(1000);
    //发送TCP数据
    client.println("tick");

    //接收到数据
    if (client.available())
    {
      String line = client.readStringUntil('\n');
      //串口打印所接收到的数据
      Serial.print("receive:");
      Serial.println(line);
    }
  }

}


```



### DHT11(可选学)
&emsp;在我做的教程里，本来是通过程序生成随机数来模拟“从温度传感器上拿到的数据”，从而省少了温度传感器的费用。当然，有部分读者会觉得不踏实，不完整，所以有读者把连接DHT11，并把代码分享出来了。温湿度传感器DHT11总共有三个引脚（电源、数据、地），电源与地分别接NodeMCU的VCC（或3.3V）与地线，数据线所接引脚要与代码相符合。感谢该读者提供了相关的代码供大家参考：

```c
#include <dht11.h> // 要使用dht11.h，需要引用，接下来后面有讲怎么引用。
dht11 DHT11;
// 这里定义了DHT11 要连接 的引脚
#define DHT11_PIN 13

void setup() {
  Serial.println("init");
}

void loop() {
  // 读取数值并打印到串口
  int chk = DHT11.read(DHT11_PIN);
  Serial.print("Temperature=");//温度
  Serial.println(DHT11.temperature);
  Serial.print("Humidity=");//湿度
  Serial.println(DHT11.humidity);
  delay(1000);
}
```


&emsp;要使用`<dht11.h>`，就要装第三方库或自行手动添加以下库文件，[Arduino IDE 库文件如何添加？](http://yfrobot.com/thread-11842-1-1.html)，将库文件放到至Arduino IDE 所在文件夹的libraries文件夹中，如（/arduino/libraries）：

```H
#ifndef dht11_h
#define dht11_h

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

#define DHT11LIB_VERSION "0.4.1"

#define DHTLIB_OK				0
#define DHTLIB_ERROR_CHECKSUM	-1
#define DHTLIB_ERROR_TIMEOUT	-2

class dht11
{
public:
    int read(int pin);
	int humidity;
	int temperature;
};
#endif
//
// END OF FILE
//
```

```c
//
//    FILE: dht11.cpp
// VERSION: 0.4.1
// PURPOSE: DHT11 Temperature & Humidity Sensor library for Arduino
// LICENSE: GPL v3 (http://www.gnu.org/licenses/gpl.html)
//
// DATASHEET: http://www.micro4you.com/files/sensor/DHT11.pdf
//
// HISTORY:
// George Hadjikyriacou - Original version (??)
// Mod by SimKard - Version 0.2 (24/11/2010)
// Mod by Rob Tillaart - Version 0.3 (28/03/2011)
// + added comments
// + removed all non DHT11 specific code
// + added references
// Mod by Rob Tillaart - Version 0.4 (17/03/2012)
// + added 1.0 support
// Mod by Rob Tillaart - Version 0.4.1 (19/05/2012)
// + added error codes
//

#include "dht11.h"

// Return values:
// DHTLIB_OK
// DHTLIB_ERROR_CHECKSUM
// DHTLIB_ERROR_TIMEOUT
int dht11::read(int pin)
{
	// BUFFER TO RECEIVE
	uint8_t bits[5];
	uint8_t cnt = 7;
	uint8_t idx = 0;

	// EMPTY BUFFER
	for (int i=0; i< 5; i++) bits[i] = 0;

	// REQUEST SAMPLE
	pinMode(pin, OUTPUT);
	digitalWrite(pin, LOW);
	delay(18);
	digitalWrite(pin, HIGH);
	delayMicroseconds(40);
	pinMode(pin, INPUT);

	// ACKNOWLEDGE or TIMEOUT
	unsigned int loopCnt = 10000;
	while(digitalRead(pin) == LOW)
		if (loopCnt-- == 0) return DHTLIB_ERROR_TIMEOUT;

	loopCnt = 10000;
	while(digitalRead(pin) == HIGH)
		if (loopCnt-- == 0) return DHTLIB_ERROR_TIMEOUT;

	// READ OUTPUT - 40 BITS => 5 BYTES or TIMEOUT
	for (int i=0; i<40; i++)
	{
		loopCnt = 10000;
		while(digitalRead(pin) == LOW)
			if (loopCnt-- == 0) return DHTLIB_ERROR_TIMEOUT;

		unsigned long t = micros();

		loopCnt = 10000;
		while(digitalRead(pin) == HIGH)
			if (loopCnt-- == 0) return DHTLIB_ERROR_TIMEOUT;

		if ((micros() - t) > 40) bits[idx] |= (1 << cnt);
		if (cnt == 0)   // next byte?
		{
			cnt = 7;    // restart at MSB
			idx++;      // next byte!
		}
		else cnt--;
	}

	// WRITE TO RIGHT VARS
        // as bits[1] and bits[3] are allways zero they are omitted in formulas.
	humidity    = bits[0]; 
	temperature = bits[2]; 

	uint8_t sum = bits[0] + bits[2];  

	if (bits[4] != sum) return DHTLIB_ERROR_CHECKSUM;
	return DHTLIB_OK;
}
//
// END OF FILE
//
```


### 如何区分不同类型的数据（扩展补充）
&emsp;那么问题来了，在demo中，我是使用程序生成模拟数来模拟温度的，所以我可以直接发数值，后端程序默认都当成是温度来处理：
```
24
25
23
22
```
&emsp;但现在接上硬件后发现其实数据是两种，除了温度还有湿度，就要区分开来，如何区分在于看我们怎么定义，我们可以这么定义：
```
Temperature=24
Humidity=30
Temperature=25
Humidity=31
Temperature=26
Humidity=32
```
&emsp;同时后端接收到这样的数据时，也要做对应的处理，JS可以使用 `split()`函数来拆解字符串，代码例子：
```js
let humidityValue = 0
let temperatureValue = 0
const valueString = 'Humidity=30' // 从硬件上传的数据得到这个字符串
const arr = valueString.split('=') // 把字符串根据= 来分䣓，此时arr = ['humidity','30']
if(arr[0] === 'Humidity'){
  humidityValue = arr[1] // 判断 是湿度
}else if(arr[0] === 'Temperature'){
  temperatureValue = arr[1] // 是温度
}
```
&emsp;当然，这样定义还是有问题，主要在于要上传的字节太多，在商业的角度来看就是浪费流量，成本高。所以为了省流量，一般都是用字节，比如说我可以传
```
0x2430 // 0x2430 是十六进制的写法，转换成二进制就是 0010 0100 0011 0000
0x2531
0x2632
```
&emsp;一个字节有八位，有两个数值，我可以把其中四位当作温度值十位，其中四位当作温度值的个位，这样温度值只花了一个字节，湿度值同理也只使用了一个字节，组合起来共使用了两个字节而已。更进一步地，这个在商用上还存在着一个扩展性差的问题，在工业界流行使用TVL格式（type,value,length），自行搜索学习，点到即止，不再深入扩展。


## FAQ
1. 错误提示：ESP8266WiFi.h:No such file or directory？
__答：说明没有安装ESP8266扩展开发板信息或者没选择NodeMCU开发板，导致找不到相关文件。__
2. 在开发板管理器安装esp8266 by ES8266 Community 十分缓慢，有其它办法吗？
__答：有解决办法，请看[Arduino开发板管理安装失败解决办法](/posts/10960)__
3. 哪里可以看到API文档？
答：
- [Arduino - ESP8266WiFi library](https://github.com/esp8266/Arduino/tree/master/doc/esp8266wifi)
- [Arduino Reference - WiFi library](https://www.arduino.cc/en/Reference/WiFi)

## 附录
- [Arduino IDE 搭建 ESP8266 开发环境及项目演示](https://www.jianshu.com/p/cb0274d612b5)
- [Arduino 中文社区](https://www.arduino.cn/forum.php)
- [Arduino core for ESP8266 WiFi chip - github](https://github.com/esp8266/Arduino)
- [在Windows系统上入门Arduino](https://www.arduino.cc/en/Guide/Windows?setlang=cn)
- [Quick Start to Nodemcu (ESP8266) on Arduino IDE](https://www.instructables.com/id/Quick-Start-to-Nodemcu-ESP8266-on-Arduino-IDE/)
- [Arduino - ESP8266WiFi library](https://github.com/esp8266/Arduino/tree/master/doc/esp8266wifi)
- [Arduino Reference - WiFi library](https://www.arduino.cc/en/Reference/WiFi)