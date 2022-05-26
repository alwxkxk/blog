---
title: flyway跟随spring-boot启动运行
toc: true
abbrlink: 58029
date: 2022-05-26 17:08:07
tags:
- java
---


&emsp;为了方便记录数据库的表变更情况，发现了数据库版本管理软件，而java对应的是[flyway](https://flywaydb.org/)。
&emsp;我先是大概看了一下官方文档，然后就参考别人的教程用一下。[Flyway快速上手教程](https://www.jianshu.com/p/567a8a161641)，发现我用`Flyway 8.5.11`版本在`JAVA 17`，`spring boot 2.5.4`，`MySQL 8`里并不像他那教程里，能够跟着spring-boot启动运行。

&emsp;翻看其它教程，很多都是配置好就能用、写测试类里用、使用Maven里调用。最终还是尝试官方文档里的[方法](https://flywaydb.org/documentation/usage/api/#jdbc-drivers)。

在pom.xml里引入最新的依赖：
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
    <version>8.5.11</version>
</dependency>
```
在ServerApplication里初始化时调用执行：
```java
import org.flywaydb.core.Flyway;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	@Bean
	CommandLineRunner init() {
        
		return (args) -> {
            // 注意写代码时不要这要暴露敏感配置，这里仅仅是为了方便测试演示
			Flyway flyway = Flyway.configure().dataSource(
					"jdbc:mysql://localhost:3306/test?useSSL=true&useUnicode=true&characterEncoding=UTF-8",
					"root",
					"inputYourDbPassword"
			).load();
			flyway.migrate();
		};
	}

}
```
&emsp;根据[Flyway快速上手教程](https://www.jianshu.com/p/567a8a161641)在`src/main/resources/db/migration`里创建一个`V1__create_user.sql`文件。
```sql
CREATE TABLE IF NOT EXISTS `USER`(
    `USER_ID`          INT(11)           NOT NULL AUTO_INCREMENT,
    `USER_NAME`        VARCHAR(100)      NOT NULL COMMENT '用户姓名',
    `AGE`              INT(3)            NOT NULL COMMENT '年龄',
    `CREATED_TIME`     datetime          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `CREATED_BY`       varchar(100)      NOT NULL DEFAULT 'UNKNOWN',
    `UPDATED_TIME`     datetime          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UPDATED_BY`       varchar(100)      NOT NULL DEFAULT 'UNKNOWN',
    PRIMARY KEY (`USER_ID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
&emsp;然后执行发现报错：`org.flywaydb.core.api.FlywayException: No database found to handle`，检查了一下数据库地址应该没错，所以google了一下，发现github issue里有[讨论](https://github.com/flyway/flyway/issues/3355)，里面的讨论结果是还要引入依赖`flyway-mysql`，所以再给在pom.xml里引入依赖：

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
    <version>8.5.11</version>
</dependency>
```

&emsp;然后右键Maven->Reload project安装完依赖后重新运行就成功了。我也不知道是不是他们测试的旧版本，是配置了就可以自动运行，反正我是不行。


