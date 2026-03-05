---
title: 使用AI完全做一个简单项目的记录
toc: true
abbrlink: 43137
date: 2026-02-12 17:44:40
tags:
img: /blog_images/AI/AI疲劳.webp
---

&emsp;之前折腾了好久的Codex，然后最终发现Claude Code还是成熟一点（靠白嫖anyRouter，不需要花钱。），就开始想着做个简单的项目来测试一下。从[anyRouter](https://anyrouter.top/)里的记录来看，我大概花费了100多美元。这已经是我一直使用最便宜的Haiku模型(每百万输入输出$1/$5，再乘0.5倍)，中间有用Opus 4.5模型操作了几下（每百万输入输出$5/$25，再乘2.5倍）。
![anyrouter公益站](/blog_images/AI/anyrouter公益站.webp)

## 构建项目
&emsp;一开始，我想着做一个AI对话，生成echart图表渲染到页面，于是在[GLM4.6网页](https://chat.z.ai/)上先让AI出一个场景，调整了一下作为我的项目简介放到`CLAUDE.md`：
```md
# 项目简介
用户在前端界面上与AI聊天，动态修改前端界面的项目。场景描述如下：

1. 用户在聊天框输入：“画一个饼图，显示各部门预算：市场部500万，研发部800万，销售部600万。”
2. 前端通过 POST /api/chat 将消息发送给后端。
3. 后端接收消息，调用AI API，Prompt中包含用户请求和ECharts的JSON Schema或示例。
4. AI返回一段echart 完整的options数据。（AI思考过程要实时返回到前端的聊天窗口显示）。
5. 后端解析数据，校验通过。
6. 后端将这条聊天消息和生成的options存入MySQL。
7. 后端通过WebSocket向前端发送消息：{ type: "update_chart", chartId: "main", options: { ... } }。
8. 前端监听到消息，调用 myChart.setOption(newOptions)，图表瞬间更新。
9. 前端在聊天窗口显示AI的文本回复（可以是对生成图表的简单描述，例如：“好的，已为您生成预算分布饼图。”）。
```

## 使用openspec
&emsp;使用[openspec](https://github.com/Fission-AI/OpenSpec)来制订计划，使用`/openspec:proposal xxxx，请帮我完成xx功能...`来让AI制作(我用的时候还是旧命令，而新版的命令变了)。它默认是输出英文的，看的效率不高我就让他输出中文了，制订完计划就审核一下看看,就直接`/openspec:apply`，AI完成开发后，就开始归档`/openspec:archive`。归档时开始发现问题了，会提示缺失一些关键字，于是我又添加了一些规则：
```
openspec创建文件时，除了保持SHALL与MUST,其他内容必须翻译成中文。（保留技术术语和关键词如SHALL、MUST、Given、When、Then、Requirement、Change、Why、What Changes、Impact等。）
```
&emsp;虽然可以输出中文（混杂了这些英文关键字）并可以开始了，但时不时还是会报错，虽说AI能修复，但总觉得还没处于完美状态。整个功能开发下来，最终创建了十个归档：

```
  1. 2026-01-22-add-frontend-login-ui/                                                                                           
  2. 2026-01-22-add-user-login/                                                                                                  
  3. 2026-01-26-add-websocket-heartbeat/                                                                                         
  4. 2026-01-28-add-ai-chat-panel/                                                                                               
  5. 2026-01-30-openai-integration/                                                                                              
  6. 2026-02-06-standardize-message-id-generation/                                                                               
  7. 2026-02-06-stop-ai-chat/                                                                                                    
  8. 2026-02-09-add-ai-chat-history/                                                                                             
  9. 2026-02-11-add-chart/                                                                                                       
  10. 2026-02-12-add-chart-to-index/    
```
&emsp;在前期，AI在proposal阶段写的方案、设计、实施目标，我还会先大概了解一下，以为“只要慎始就能更好地约束ai来按我的想法办事”。但实际审下来，十分地累，所以后面我就不审了，为了保证“慎始”，我开始让AI先自己检查出问题，然后再修复一次后才执行：
```
# 设计
/openspec:proposal add-ai-chat-panel，请帮我添加一个AI聊天对话窗口。

# 新建对话 自查
请对add-ai-chat-panel下的文档检查，请总结出这些方案可能会存在哪些问题或者需要明确的地方，输出到problem.md里。

# 针对problem.md的问题回答后
problem.md的问题我已经回答，请对add-ai-chat-panel里的文档进行调整。

# 继续后续的方案执行与归档
....
```

&emsp;当然，每次归档的git提交都是人工操作，至少我要简单审一下，发现不少没必要的临时文件人工手动删了。虽说在最后阶段试图人工把握，但这也导致无法整个流程全AI自动，效率并不高。下一阶段尝试AI全自动，后续发现问题就后面改，而不是试图保证每次提交都是"高质量的"，用AI就得“效率优先”，质量事后把控。（开发新功能开分支，人工测试功能通过后，`git rebase -i xxx`来[变基合并](https://zhuanlan.zhihu.com/p/24517826766)AI提交的所有commit,再检查每个文件的代码情况，调整完后再调整一次commit,最后合并分支。）

## 使用chrome-devtools mcp调试
&emsp;AI写的测试代码其实不一定准，最终还要到浏览器去检查，当然我配置好了`chrome-devtools` mcp，让AI自行控制浏览器去进行第一次检查，通过后我再人工来检查一下页面是否符合我的预期，我发现什么问题就告诉AI调整。整体搞下来，感觉就是这一阶段token浪费很多(尤其是我这个页面是需要登陆，每次光登陆调试帐号都花不少时间)，时间也很长，Haiku模型还时不时解决不了问题（一直尝试），最后我换Opus 4.5模型这种高级模型来解决问题：
```
我已启动前后端，请使用mcp里的工具（请阅读doc/mcp-tool.md）来控制chrome进行调试（前端端口为5173）。调试用的帐号：xxxxxx，密码：xxxxxxxx。 请帮我解决XXX问题.....
```
&emsp;后续下一个项目要用上skills，来提升AI使用工具的效率。

## 数据库调试
&emsp;这个项目的后端是用python，数据库版本管理alembic，一开始我就发现AI在开发后端时，会时不时拿着环境变量文件的配置来直连我本地的数据库（这就意味着数据库的敏感数据泄漏了），最终我规定好：
```
禁止直接连接数据库，所有操作通过脚本配合alembic，读取环境变量来操作数据库
```
&emsp;这样确实不再直连了，理论上就不会再把敏感数据泄漏出去了。

## 总结
&emsp;总体感觉就是，代码写得快（特别是测试代码，如果我个人小项目一般就懒得浪费时间写测试，但在AI写代码，这个测试输出得快而且也很有必要，防止AI瞎搞把旧代能都破坏掉了）,写点个人小项目十分好用。
&emsp;大型项目里，我只敢让在网页端AI里，明确函数的输入参数与输出预期结果，这种函数级的AI生成代码也是相当快，而且不会乱动我的代码。

## 附录
- [everything-claude-code](https://github.com/affaan-m/everything-claude-code)记录了一些好用的技巧。
- [V站-AI编程更累了](https://www.v2ex.com/t/1192730#;)，特别是37楼转发的Khare 关于 AI疲惫 的博客，十分符合AI编程所存在的问题。
