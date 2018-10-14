---
title: nodemcu基础
toc: true
abbrlink: 31494
date: 2018-10-13 17:05:22
tags:
---

&emsp;最近发现arduino IDE可以开发nodemcu，惊喜若狂，因为在以前，开发是十分麻烦的。先买一块nodemcu（超便宜的，最便宜十几块钱就能在淘宝上买到）,安装驱动精灵（用于安装串口驱动的），安装arduino-1.8版本以上[arduino1.8.7（百度网盘）](https://pan.baidu.com/s/1E6wDSEYoeDoAm9GhUGwdaw)

# nodemcu简介
&emsp;nodemcu本质就是ESP8266+USB转串口芯片，ESP8266是一块可编程的WIFI芯片。
![nodemcu开发板](http://ww1.sinaimg.cn/large/005BIQVbgy1fw7hfkw1z0j305k046jr8.jpg)
![nodemcu引脚图](http://ww1.sinaimg.cn/large/005BIQVbgy1fw7hir4bdrj30si0fuwmo.jpg)
# 使用Arduino编程
&emsp;这里演示一下开发环境的搭建以及最简demo。
## 搭建开发环境
- 安装串口驱动，USB转串口芯片有些用cpXX，有些是CHxx，插上nodemcu后让驱动精灵来安装对应驱动即可。
<video class="lazy" controls data-src="https://test-1251805228.cos.ap-guangzhou.myqcloud.com/%E4%BD%BF%E7%94%A8%E9%A9%B1%E5%8A%A8%E7%B2%BE%E7%81%B5%E5%AE%89%E8%A3%85%E4%B8%B2%E5%8F%A3%E9%A9%B1%E5%8A%A8.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>
- 安装arduino-1.8版本以上[arduino1.8.7（百度网盘）](https://pan.baidu.com/s/1E6wDSEYoeDoAm9GhUGwdaw)(安装过程一直next就是，我就不录视频了)，配置ESP8266扩展开发板网址并安装。（我已经配置并安装了，你们自行安装一下）扩展开发板网址:`http://arduino.esp8266.com/stable/package_esp8266com_index.json`
<video class="lazy" controls data-src="https://test-1251805228.cos.ap-guangzhou.myqcloud.com/nodemcu%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83arduino%20IDE%E9%85%8D%E7%BD%AE.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>
&emsp;如果连接上开发板并可以看到开发板信息，说明都正常了，可以编程了。

## 最简demo
&emsp;展示一个定时串口打印信息的最简demo。
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
<video class="lazy" controls data-src="https://test-1251805228.cos.ap-guangzhou.myqcloud.com/nodemcu%E6%9C%80%E7%AE%80demo.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>




# 附录
- [Arduino core for ESP8266 WiFi chip - github](https://github.com/esp8266/Arduino)
- [在Windows系统上入门Arduino](https://www.arduino.cc/en/Guide/Windows?setlang=cn)
- [Quick Start to Nodemcu (ESP8266) on Arduino IDE](https://www.instructables.com/id/Quick-Start-to-Nodemcu-ESP8266-on-Arduino-IDE/)
