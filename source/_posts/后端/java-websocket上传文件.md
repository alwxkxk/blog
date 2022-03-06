---
title: java-websocket上传文件
toc: true
tags:
  - java
abbrlink: 38508
date: 2022-03-06 19:47:50
---

&emsp;最近在研究java spring boot 通过 websocket上传文件。


&emsp;通过`setMaxTextMessageBufferSize`来限制上传文件的最大空间（如果没设置，则默认是不限制的大小的）：
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
        // TODO: 文件上限大小 放到properties 里
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
        // TODO:异常关闭的原因需要记录到日志中
        if (reason.getReasonPhrase() != null) {
            System.out.println("ws 异常关闭：" + reason);
        }
        System.out.println("ws 连接关闭");
    }
}
```

&emsp;我直呼好家伙。本来我是幻想着，当发生这个超出限制的异常时，捕抓到并给前端返回一个异常消息方便弹窗显示。好家伙，直接就把连接给掐断了。经过我一番折腾后，没能实现我的幻想，只能换个方案。新方案比我原本最初设想的方案还要好，当前端建立连接时后端给前端返回一个限制大小的值，前端上传之前自行检查是否超出限制，若超出直接弹窗提示而不是上传到后端。
