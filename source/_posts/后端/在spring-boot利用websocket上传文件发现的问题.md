---
title: 在spring-boot利用websocket上传文件发现的问题
toc: true
tags:
  - java
abbrlink: 38508
date: 2022-03-06 19:47:50
img: /blog_images/后端/expectation_response_action.webp
---

&emsp;最近在研究java在spring boot(V2.5.4) 通过 websocket上传文件。最终发现这条方案不可行。

## 当超出大小限制时直接关闭连接

&emsp;通过`setMaxTextMessageBufferSize`来限制上传文件的最大空间（如果没设置，则默认是8192，对应1KB）：
```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

@Configuration
@EnableWebSocket
public class WebSocketConfig {

    @Bean
    public ServerEndpointExporter serverEndpoint() {
        return new ServerEndpointExporter();
    }

    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        container.setMaxTextMessageBufferSize(100);
        container.setMaxBinaryMessageBufferSize(100);
        return container;
    }

}
```

&emsp;当我测试从前端传一个大于限制的文件时，发现这个websocket直接就关闭了，没有任何报错信息。搞得我一脸蒙逼，还能这样子玩？好家伙，查了不少资料，分析代码，发现这个异常由`org.springframework.web.socket.handler.ExceptionWebSocketHandlerDecorator.tryCloseWithError`处理了，当发生后端接收到超过限制大小时，直接当作异常处理，将异常信息输出到`CloseReason`实例中，并关闭连接。在`OnClose`多传一个`CloseReason reason`能看到这个对象，我测试时打印出来是：`CloseReason: code [1009], reason [No async message support and buffer too small. Buffer size: [100], Message size: [130]]`：


```java
@ServerEndpoint("/file")
@Component
public class FileEndPoint {
    @OnClose
    public void onClose(Session session, CloseReason reason) {
        if (reason.getReasonPhrase() != null) {
            System.out.println("ws 异常关闭：" + reason);
        }
        System.out.println("ws 连接关闭");
    }
}
```

&emsp;我直呼好家伙。本来我是幻想着，当发生这个超出限制的异常时，捕抓到并给前端返回一个异常消息方便弹窗显示。好家伙，直接就把连接给掐断了。经过我一番折腾后，没能实现我的幻想，只能换个方案。新方案比我原本最初设想的方案还要好，当前端建立连接时后端给前端返回一个限制大小的值，前端上传之前自行检查是否超出限制，若超出直接弹窗提示而不是上传到后端。

## 每一个连接都提前分配内存导致占用大量内存
&emsp;当我将最大值设置成50MB时，发现只建立只三个连接就会报错：`ERROR org.apache.coyote.http11.Http11NioProtocol - Failed to complete processing of a request java.lang.OutOfMemoryError: Java heap space` :
```java
public class WebSocketConfig {
    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        // 设置50MB
        container.setMaxTextMessageBufferSize(50 * 8 * 1024 * 1024);
        container.setMaxBinaryMessageBufferSize(50 * 8 * 1024 * 1024);
        return container;
    }

}
```
&emsp;定位时发现，程序跑起来时，只占用140MB，连接第一个连接后，内存就暴涨到1376MB了，第二个连接就让内存暴涨2642MB，第三个连接就`OutOfMemoryError`了，因为已经超出了4G的默认内存。这太可怕，这明显不能用。还有另外一个问题，我测试配置1000MB时，会报错`java.lang.IllegalArgumentException: capacity < 0: (-201326592 < 0)`，定位发现是因为使用Int类型，所以取值范围为： -2^31——2^31-1，即-2147483648——2147483647 ,即最多255MB。
&emsp;暂时无法解决这个问题，在spring-boot利用websocket上传文件基本不可行了。