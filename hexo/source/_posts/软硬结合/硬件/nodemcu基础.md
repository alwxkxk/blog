---
title: nodemcu基础
toc: true
abbrlink: 31494
date: 2018-10-13 17:05:22
tags:
- Arduino
- ESP8266
- nodemcu
---

&emsp;最近发现arduino IDE可以开发nodemcu，惊喜若狂，因为在以前，开发是十分麻烦的。先买一块nodemcu（超便宜的，最便宜十几块钱就能在淘宝上买到）,安装驱动精灵（用于安装串口驱动的），安装arduino-1.8版本以上[arduino1.8.7（百度网盘）](https://pan.baidu.com/s/1E6wDSEYoeDoAm9GhUGwdaw)

## nodemcu简介
&emsp;nodemcu本质就是ESP8266+USB转串口芯片，ESP8266是一块可编程的WIFI芯片。
![nodemcu引脚图](/blog_images/005BIQVbgy1fw7hir4bdrj30si0fuwmo.jpg)
&emsp;淘宝价大约在十几块钱，如果是第一次玩硬件，自己没有USB线的话，记得还要额外买 __一条线__ ：

<img alt="淘宝nodemcu" src="/blog_images/005BIQVbgy1fyy8y8neuij30rw0dbtfj.jpg" style="cursor:pointer;">

&emsp;__特别注意：nodemcu分V2与V3版本（非官方承认），两者略有不同，其中V3略便宜且LED引脚略有不同，写代码需要另外定义引脚:__`#define LED_BUILTIN 2`
![](/blog_images/005BIQVbgy1fz9u3c3howj30my0bvdpc.jpg)
# 使用Arduino编程
&emsp;这里演示一下开发环境的搭建以及最简demo。
## 搭建开发环境
- 安装串口驱动，USB转串口芯片有些用cpXX，有些是CHxx，插上nodemcu后让驱动精灵来安装对应驱动即可。
<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com/%E4%BD%BF%E7%94%A8%E9%A9%B1%E5%8A%A8%E7%B2%BE%E7%81%B5%E5%AE%89%E8%A3%85%E4%B8%B2%E5%8F%A3%E9%A9%B1%E5%8A%A8.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>
- 安装arduino-1.8版本以上[arduino1.8.7（百度网盘）](https://pan.baidu.com/s/1E6wDSEYoeDoAm9GhUGwdaw)(安装过程一直next就是，我就不录视频了)，配置ESP8266扩展开发板网址并安装。（我已经配置并安装了，你们自行安装一下，安装过程可能会比较慢。）扩展开发板网址:`http://arduino.esp8266.com/stable/package_esp8266com_index.json`。
<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com/nodemcu%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83arduino%20IDE%E9%85%8D%E7%BD%AE.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>
&emsp;如果实在速度太慢安装不了有其它办法安装，请看另一文章：[Arduino开发板管理安装失败解决办法](/posts/10960)。
&emsp;安装完扩展开发板信息后，记得选择开发板为nodemcu。如果连接上开发板并可以看到开发板信息，说明连接正常，可以编程了。**大家不要急着跑demo1例程，应该先跑第一个例程：控制LED，上传代码后LED灯会一直闪烁，这就证明硬件没问题。如果LED灯不一直闪烁可能是V3版本，需要定义引脚或者硬件有问题。其次要学会看串口打印信息，根据打印信息判断代码执行到哪里，哪一环节出现异常。**

## 例程

### 控制LED
&emsp;nodemcu板LED灯闪烁。
&emsp;__特别注意：nodemcu分V2与V3版本，两者略有不同，其中V3的LED引脚略有不同，写代码需要另外定义引脚:`#define LED_BUILTIN 2`，即把第二行代码取消注释。__
```c
//如果是nodemcu V3版，需要另外定义LED引脚
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
<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com/nodemcu%E6%9C%80%E7%AE%80demo.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>

### TCP通信-串口打印
&emsp;注意根据实际情况修改WIFI的标识号与密码（第3、4行），与TCP服务器的IP地址、端口号（第6、7行）。

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

### TCP通信-demo1
&emsp;注意修改WIFI地址与密码。
&emsp;__特别注意：nodemcu分V2与V3版本，两者略有不同，其中V3的LED引脚略有不同，写代码需要另外定义引脚:__`#define LED_BUILTIN 2`
&emsp;有网友问到，WIFI连接成功了，但提示连接失败，这个IP地址是需要填什么？ IP地址是需要填写TCP服务端的IP址，前期调试可以使用网络调试助手来充当TCP服务端：
![物联网项目](/blog_images/nodemcu与网络调试助手联调.jpg)

```c
//如果是nodemcu V3版，需要另外定义LED引脚
//#define LED_BUILTIN 2 
#include <ESP8266WiFi.h>
//必须修改：填写你的WIFI帐号密码
const char* ssid = "you-wifi";
const char* password = "you-wifi-password";

const char* host = "119.29.107.47";
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

### DHT11
&emsp;上面的例子是我自己写的，并且模拟出数据来。如果要产生真实的数据，就需要接上真实的传感器，温湿度传感器DHT11。DHT11总共有三个引脚（电源、数据、地），电源与地分别接nodemcu的VCC（或3.3V）与地线，数据线所接引脚要与代码相符合。有位读者提供了相关的代码供大家参考：

```c
#include <dht11.h>
dht11 DHT11;
// 这里定义了DHT11 要连接 的引脚
#define DHT11_PIN 13

void setup() {
  Serial.println("init");
}

void loop() {
  // 读取数值并打印到串口
  int chk = DHT11.read(DHT11_PIN);
  Serial.print("Temperature = ");//温度
  Serial.println(DHT11.temperature);
  Serial.print("Humidity = ");//湿度
  Serial.println(DHT11.humidity);
  delay(1000);
}
```
&emsp;在demo2中，我们只传一个模拟生成的数值，如果要传两个值的话，就要想个办法让服务器识别出这两个不同类型的数据。方法有很多种，我举一个例子：上传时`temprature:24`,`humidity:30`，服务器解析时用 `split()`函数来拆解字符串，代码例子：
```js
let humidityValue = 0
let temperatureValue = 0
const valueString = 'humidity:30' // 从硬件上传的数据得到这个字符串
const arr = valueString.split(':') // 此时arr = ['humidity','30']
if(arr[0] === 'humidity'){
  humidityValue = arr[1] // 判断 是湿度
}else{
  temperatureValue = arr[1] // 是温度
}

// 这样就能识别出这个30是来自于humidity的值，继续做其它的事.....
```

&emsp;要使用`<dht11.h>`，就要装第三方库或自行手动添加以下库文件，[Arduino IDE 库文件如何添加？](http://yfrobot.com/thread-11842-1-1.html)，将库文件放到至arduino IDE 所在文件夹的libraries文件夹中，如（/arduino/libraries）：

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


## FAQ
1. 错误提示：ESP8266WiFi.h:No such file or directory？
__答：说明没有安装ESP8266扩展开发板信息或者没选择nodemcu开发板，导致找不到相关文件。__
2. 在开发板管理器安装esp8266 by ES8266 Community 十分缓慢，有其它办法吗？
__答：有解决办法，请看[Arduino开发板管理安装失败解决办法](/posts/10960)__
3. 哪里可以看到API文档？
答：
- [Arduino - ESP8266WiFi library](https://github.com/esp8266/Arduino/tree/master/doc/esp8266wifi)
- [arduino Reference - WiFi library](https://www.arduino.cc/en/Reference/WiFi)

## 附录
- [arduino 中文社区](https://www.arduino.cn/forum.php)
- [Arduino core for ESP8266 WiFi chip - github](https://github.com/esp8266/Arduino)
- [在Windows系统上入门Arduino](https://www.arduino.cc/en/Guide/Windows?setlang=cn)
- [Quick Start to Nodemcu (ESP8266) on Arduino IDE](https://www.instructables.com/id/Quick-Start-to-Nodemcu-ESP8266-on-Arduino-IDE/)
- [Arduino - ESP8266WiFi library](https://github.com/esp8266/Arduino/tree/master/doc/esp8266wifi)
- [arduino Reference - WiFi library](https://www.arduino.cc/en/Reference/WiFi)