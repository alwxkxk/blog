---
title: claude与codex的mcp服务折腾对比
toc: true
abbrlink: 57125
date: 2026-01-09 08:59:05
tags:
img: /blog_images/AI/使用AI工具.webp
---


&emsp;在使用codex的过程中，我发现它经常不会按我的想法来调用mcp里的一些工具。看到L站的论坛经验，需要让AI先生成使用mcp工具的规则，然后就会好很多：
&emsp;L站有个大佬的帖子是这样说的：
```
让其在 MD 文档中列出自己目前拥有的所有的 tools 名称和功能。
让 Codex 列出这些 tools 中冲突和或重复的部分。
比如我发现其自带 web search 功能，我让他分别调用 duckduckgo 和 web search 去搜索一些东西，然后保留了效果好的那个
情景模拟，例：‘假如我现在需要调整一个函数的功能，你会使用哪些工具？’
追问：为什么不使用 xxx？
反复步骤 3，梳理自己的 MCP 工具，去繁从简。
最后：‘我希望你能充分利用剩余的 MCP 工具，给我一个标准的工作流’
一般 Codex 会回复 3-5 句话。把这个放进 AGENTS.MD 的工具调用或是工作流环节。
```


# codex mcp折腾
&emsp;codex 0.77(25年12月)，模型是openrouter.ai里的免费模型kwaipilot/kat-coder-pro:free，让其列出mcp工具:
```bash
列出mcp资源

• Called codex.list_mcp_resources()
  └ {"resources": []}

• 已列出当前可用的 MCP 资源。目前没有可用的资源。
```
&emsp;然后我搜了一下，好像是因为这些工具没有resources，只有tool。于是我输入 `/mcp`来继续查看定位：

```bash
/mcp

  • mcp_router
    • Command: npx -y @mcp_router/cli@latest connect
    • Env: MCPR_TOKEN=*****
    • Tools: click, close_page, create_directory, directory_tree, drag, edit_file, emulate, evaluate_script, fill, fill_form, get_console_message, get_file_info, get_network_request, handle_dialog, hover,
list_allowed_directories, list_console_messages, list_directory, list_directory_with_sizes, list_network_requests, list_pages, move_file, navigate_page, new_page, performance_analyze_insight,
performance_start_trace, performance_stop_trace, press_key, read_file, read_media_file, read_multiple_files, read_text_file, resize_page, search_files, select_page, take_screenshot, take_snapshot, upload_file,
wait_for, write_file
```

&emsp;心想会不会是因为mcp_router导致的问题，于是就手动配置这些mcp，再执行`/mcp`，
```bash
/mcp

  • chrome-devtools-mcp
    • Status: enabled
    • Auth: Unsupported
    • Command: npx -y chrome-devtools-mcp@latest --channel=canary --isolated=true --registry=https://registry.npmmirror.com
    • Resources: (none)
    • Resource templates: (none)

  • filesystem
    • Status: enabled
    • Auth: Unsupported
    • Command: npx -y @modelcontextprotocol/server-filesystem 
    • Tools: create_directory, directory_tree, edit_file, get_file_info, list_allowed_directories, list_directory, list_directory_with_sizes, move_file, read_file, read_media_file, read_multiple_files,
read_text_file, search_files, write_file
```
&emsp;然后再尝试列出mcp tool，还是列不出，最终还是让AI是根据网络知识来列出这两个mcp有什么工具可用，每个要怎么用。但我不满意，因为其并不是按照`1.我这里有什么mcp工具。2.我应该要怎么使用这些mcp工具。`,第一步就卡住了,codex无法列出自身mcp拥有的tool,应该后续迭代会优化。

# claude code mcp折腾
&emsp;codex的表现不如人意，我就突发其想试一下claude code是否会有更好的表现。安装并折腾至国内代理后(使用响应更快更便宜的)，开始测试：
```
1.列出自己目前拥有的所有的 tools 名称和功能。（AI检查出所有tool，并写入到TOOLS.md里）
2. 列出这些 tools 中冲突和或重复的部分。
3. @TOOLS.md 请优化,只保留建议使用的工具。（）

```
&emsp;最终得出有用的文档，结果如下（还额外增加了context7与sequential-thinking）：
```
# Claude Code 推荐工具列表

## 任务和代理管理

| 工具名 | 功能 |
|-------|------|
| **Task** | 启动专门的代理来处理复杂的多步任务。支持多种代理类型：general-purpose、statusline-setup、Explore、Plan、claude-code-guide |
| **TaskOutput** | 从运行中或已完成的任务中检索输出，支持阻塞和非阻塞模式 |
| **EnterPlanMode** | 进入计划模式，用于在实现代码前设计实现策略和获得用户批准 |
| **ExitPlanMode** | 退出计划模式，在完成计划后向用户呈现方案 |

## 代码编辑和文件操作

| 工具名 | 功能 |
|-------|------|
| **Read** | 从本地文件系统读取文件内容（支持文本和图像） |
| **Write** | 将文件写入本地文件系统（如果文件存在会覆盖） |
| **Edit** | 在文件中执行精确字符串替换，支持 replace_all 和正则表达式 |
| **Glob** | 快速文件模式匹配工具，支持 glob 模式查找文件 |
| **Grep** | 基于 ripgrep 的强大搜索工具，支持正则表达式和多行匹配 |
| **Bash** | 在持久化 shell 会话中执行 bash 命令，支持超时和后台执行 |
| **NotebookEdit** | 编辑 Jupyter notebook（.ipynb）文件的单元格内容 |
| **KillShell** | 终止运行的后台 bash shell 进程 |

## 代码智能和诊断

| 工具名 | 功能 |
|-------|------|
| **LSP** | 与语言服务器协议（LSP）交互以获取代码智能，支持的操作：goToDefinition、findReferences、hover、documentSymbol、workspaceSymbol 等 |
| **mcp__ide__getDiagnostics** | 从 VS Code 获取语言诊断信息 |
| **mcp__ide__executeCode** | 在 Jupyter kernel 中执行 Python 代码 |

## 任务跟踪和用户交互

| 工具名 | 功能 |
|-------|------|
| **TodoWrite** | 创建和管理结构化任务列表，支持任务状态跟踪（pending、in_progress、completed） |
| **AskUserQuestion** | 在执行期间向用户提问，支持单选和多选选项 |

## Web 和文档

| 工具名 | 功能 |
|-------|------|
| **WebFetch** | 从指定 URL 获取内容并使用 AI 模型处理，支持缓存 |
| **WebSearch** | 搜索网络并使用最新信息，支持域名过滤 |
| **mcp__mcp-router__resolve-library-id** | 将包/产品名称解析为 Context7 兼容的库 ID |
| **mcp__mcp-router__query-docs** | 从 Context7 检索和查询最新的库文档和代码示例 |

## 技能和 MCP 资源

| 工具名 | 功能 |
|-------|------|
| **Skill** | 执行预定义的技能（如 /commit、/review-pr、/pdf 等） |
| **ListMcpResourcesTool** | 列出来自已配置 MCP 服务器的可用资源 |
| **ReadMcpResourceTool** | 从 MCP 服务器读取特定资源 |

## 浏览器自动化

| 工具名 | 功能 |
|-------|------|
| **mcp__mcp-router__new_page** | 创建新的浏览器页面 |
| **mcp__mcp-router__select_page** | 选择页面作为后续工具调用的上下文 |
| **mcp__mcp-router__close_page** | 关闭指定的页面 |
| **mcp__mcp-router__list_pages** | 获取浏览器中打开的所有页面列表 |
| **mcp__mcp-router__navigate_page** | 导航到 URL、前进、后退或重新加载页面 |
| **mcp__mcp-router__take_screenshot** | 截取页面或元素的屏幕截图 |
| **mcp__mcp-router__take_snapshot** | 获取当前页面的文本快照（基于 a11y 树） |
| **mcp__mcp-router__resize_page** | 调整页面窗口大小 |

## DOM 交互

| 工具名 | 功能 |
|-------|------|
| **mcp__mcp-router__click** | 点击页面上的元素 |
| **mcp__mcp-router__fill** | 在输入框、文本区域或 select 元素中填入值 |
| **mcp__mcp-router__fill_form** | 一次性填写多个表单元素 |
| **mcp__mcp-router__hover** | 悬停在元素上 |
| **mcp__mcp-router__press_key** | 按下键或键组合 |
| **mcp__mcp-router__drag** | 拖动一个元素到另一个元素上 |
| **mcp__mcp-router__upload_file** | 通过文件输入元素上传文件 |
| **mcp__mcp-router__evaluate_script** | 在页面中评估 JavaScript 函数 |
| **mcp__mcp-router__handle_dialog** | 处理浏览器弹出对话框 |
| **mcp__mcp-router__wait_for** | 等待指定的文本出现在页面上 |

## 浏览器开发工具

| 工具名 | 功能 |
|-------|------|
| **mcp__mcp-router__list_console_messages** | 列出页面的所有控制台消息 |
| **mcp__mcp-router__get_console_message** | 按 ID 获取特定的控制台消息 |
| **mcp__mcp-router__list_network_requests** | 列出页面的所有网络请求 |
| **mcp__mcp-router__get_network_request** | 获取特定的网络请求信息 |

## 性能分析

| 工具名 | 功能 |
|-------|------|
| **mcp__mcp-router__performance_start_trace** | 启动性能跟踪录制并生成 Core Web Vital 分数 |
| **mcp__mcp-router__performance_stop_trace** | 停止活动的性能跟踪录制 |
| **mcp__mcp-router__performance_analyze_insight** | 获取性能洞察的详细分析信息 |
| **mcp__mcp-router__emulate** | 在页面上模拟各种功能（CPU 限流、地理位置、网络条件） |

## 文件系统操作

| 工具名 | 功能 |
|-------|------|
| **mcp__mcp-router__list_directory_with_sizes** | 获取目录列表（包括文件大小信息） |
| **mcp__mcp-router__directory_tree** | 获取文件和目录的递归树视图（JSON 格式） |
| **mcp__mcp-router__get_file_info** | 检索文件或目录的详细元数据 |
| **mcp__mcp-router__create_directory** | 创建新目录或确保目录存在 |
| **mcp__mcp-router__move_file** | 移动或重命名文件和目录 |
| **mcp__mcp-router__read_multiple_files** | 同时读取多个文件的内容（比多次调用 Read 更高效） |
| **mcp__mcp-router__list_allowed_directories** | 返回此服务器允许访问的目录列表 |

## 分析和思考

| 工具名 | 功能 |
|-------|------|
| **mcp__mcp-router__sequentialthinking** | 用于动态反思式问题解决的工具，支持分支和修订思考步骤 |

---

## 统计信息

**总计：51 个推荐工具**（已移除 14 个冗余工具）

### 按分类统计
- 任务和代理管理：4 个
- 代码编辑和文件操作：8 个
- 代码智能和诊断：3 个
- 任务跟踪和用户交互：2 个
- Web 和文档：4 个
- 技能和 MCP 资源：3 个
- 浏览器自动化：8 个
- DOM 交互：10 个
- 浏览器开发工具：4 个
- 性能分析：4 个
- 文件系统操作：7 个（减少了 6 个）
- 分析和思考：1 个

---

## 已移除的冗余工具

| 移除工具 | 推荐替代 | 原因 |
|--------|--------|------|
| `mcp__mcp-router__read_text_file` | `Read` | 功能重复，Read 更简洁全能 |
| `mcp__mcp-router__read_media_file` | `Read` | 功能重复，Read 更简洁全能 |
| `mcp__mcp-router__write_file` | `Write` | 功能完全相同，Write 更简洁 |
| `mcp__mcp-router__edit_file` | `Edit` | 功能重复，Edit 更灵活 |
| `mcp__mcp-router__search_files` | `Glob` | 功能大致相同，Glob 更简洁 |
| `mcp__mcp-router__list_directory` | `mcp__mcp-router__list_directory_with_sizes` | 后者是增强版本，包含文件大小 |

```

&emsp;个人感觉达到预期效果。