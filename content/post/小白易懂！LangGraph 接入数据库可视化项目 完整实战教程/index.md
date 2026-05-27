---
draft: false
date: 2026-05-20 16:36:00
title: "小白易懂！LangGraph 接入数据库可视化项目 完整实战教程"
categories: ["LangGragh"]
---
很多小伙伴做数据库可视化工具时，都会遇到一个痛点：**工具能看表、写SQL、查数据，但没人帮忙解读、改bug、写语句**。

今天手把手带大家用 **LangGraph** 给数据库工具接入AI智能助手，不用懂高深算法，纯工程实战，从零搭建「AI解释表、AI写SQL、AI排错SQL」功能。

全程拆解：架构逻辑、代码作用、部署调试、接口调用，新手也能一次看懂！
> [项目代码](https://github.com/ye-guan-xing/GUI-database-tool)
---

## 一、我们要解决什么问题？（通俗版）

先说说我们原本的数据库GUI工具能干啥：

- ✅ 连接MySQL数据库

- ✅ 查看数据表结构

- ✅ 手动执行SQL语句查询数据

但缺了最实用的**AI辅助能力**，接入LangGraph之后，我们的工具直接升级3个核心功能：

|功能场景|对应模式|日常使用场景|
|---|---|---|
|AI解读表结构|explain\_schema|看不懂数据表字段？AI帮你逐字解释每个字段用途|
|AI代写SQL|draft\_sql|不会写查询语句？输入需求，AI直接生成可运行SQL|
|AI排查SQL错误|debug\_query|SQL报错运行失败？AI帮你找bug、给出修改方案|

### 重要设计边界（避坑关键）

这个AI助手**非常安全，不会乱操作数据库**：

- ❌ 不直接连接数据库

- ❌ 不执行任何SQL语句

- ❌ 不修改、删除、新增数据库数据

- ✅ 只根据前端传来的页面信息，返回文字建议和SQL代码

---

## 二、整体架构讲解（大白话版）

整个项目分为 **前端Vue \+ 后端NestJS \+ Python AI服务** 三层，很多新手疑惑：**为什么要拆成两个后端？**

这里通俗解释：

- **NestJS**：负责项目主业务（连数据库、存数据、接口转发），主打稳定

- **Python**：AI、LangGraph生态全部基于Python开发，做AI功能最方便、兼容性最好

### 完整请求流程（一眼看懂）

用户操作页面 → 前端发请求 → NestJS接收转发 → Python LangGraph处理AI逻辑 → 返回结果展示到页面

简单说：**Nest只做“搬运工”，Python才是真正的AI打工人**。

三层分工：

1. **前端Vue**：展示页面、收集用户问题、传递当前数据库/表信息

2. **NestJS后端**：统一接口入口、转发请求、统一处理报错

3. **Python服务**：运行LangGraph、调用大模型、生成AI回答

---

## 三、项目目录结构（新手必看）

不用乱建文件，直接对照这个结构搭建即可：

```Plain Text
GUI-database-tool/
├── agent-service/          # Python AI核心服务（LangGraph在这里）
│   ├── app.py              # 主程序（所有AI逻辑都在这里）
│   ├── requirements.txt    # Python依赖包清单
│   └── .env                # 配置文件（密钥、模型地址）
├── backend/
│   └── src/agent/          # NestJS转发模块
│       ├── agent.module.ts
│       ├── agent.controller.ts
│       └── agent.service.ts
└── frontend/               # 原有前端页面，无需大改
```

---

## 四、Python AI服务搭建（核心功能）

### 1\. 安装依赖包

在 `agent\-service/requirements\.txt` 写入需要的依赖：

```Plain Text
langgraph
langchain
langchain-openai
fastapi
uvicorn
python-dotenv
```

终端执行命令，创建虚拟环境并安装依赖（Windows）：

```Plain Text
cd agent-service
uv venv
.\.venv\Scripts\Activate.ps1
uv pip install -r requirements.txt
```

### 2\. 配置环境变量

新建 `\.env` 文件，填入自己的大模型密钥：

```Plain Text
OPENAI_API_KEY=你的密钥
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=  # 可选，第三方模型地址可填空
```

### 3\. 启动Python服务

```Plain Text
uv run uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

启动成功后，Python服务会跑在 **8000端口**

---

## 五、Python核心代码逐句通俗讲解

### 1\. 状态定义：AI的“记事本”

LangGraph的核心就是**全局状态**，相当于一个共享记事本，所有AI功能都能读写这里的数据：

```Plain Text
class AgentState(TypedDict, total=False):
    mode: str        # 当前功能模式（解释表/写SQL/排错）
    question: str    # 用户输入的问题
    context: Dict[str, Any]  # 页面上下文（数据库名、表结构）
    answer: str      # AI最终返回的回答
```

简单理解：存用户问题、页面信息、AI结果的公共容器。

### 2\. 请求参数校验：防止乱传数据

限制用户只能用我们预设的3个功能，避免报错：

```Plain Text
class RunRequest(BaseModel):
    mode: Literal["explain_schema", "draft_sql", "debug_query"]
    question: str
    context: Optional[Dict[str, Any]] = None
```

### 3\. 连接大模型

读取配置文件，自动连接OpenAI（或兼容的第三方模型），参数做了容错，不会轻易崩溃：

- 没配置密钥直接报错提示，不静默失败

- 默认使用 gpt\-4o\-mini，性价比高

- 温度值0\.2，**回答更稳定、少胡说**，适合SQL场景

### 4\. 智能提示词切换：一个模型干三件事

我们不用写三个AI接口，**同一个大模型，切换不同身份**，实现三种功能：

- explain\_schema → 数据库讲解老师

- draft\_sql → SQL代写助手

- debug\_query → SQL排错工程师

再把用户问题、当前数据表信息传给AI，就能精准输出对应答案。

### 5\. LangGraph核心流程图（极简版）

目前的逻辑非常简单，新手无压力：

程序启动 → 读取状态 → 调用大模型 → 生成答案 → 结束

后续想加功能（比如SQL风险检测、上下文优化），直接新增节点即可，不用重构代码。

### 6\. 两个核心接口

- **GET /health**：健康检查，判断AI服务是否正常启动

- **POST /run**：核心接口，接收用户请求，执行AI逻辑并返回结果

调用示例（代写SQL）：

```Plain Text
{
  "mode": "draft_sql",
  "question": "查最近 7 天注册的用户",
  "context": {
    "database": "demo_db",
    "selectedTable": "users"
  }
}
```

---

## 六、NestJS后端适配（转发层，超简单）

NestJS这一层**不写任何AI逻辑**，只做两件事：

1. 接收前端请求，校验参数是否合法

2. 转发给Python AI服务，接收结果后统一返回给前端

### 1\. 模块注册

新建agent模块、控制器、服务文件，在全局模块中注册即可，属于Nest基础操作。

### 2\. 配置服务地址

在backend的\.env文件中配置Python服务地址：

```Plain Text
LANGGRAPH_SERVICE_URL=http://127.0.0.1:8000
```

### 3\. 接口统一规范

对外统一暴露两个接口，前端不用关心后端分层：

- `GET /api/agent/health`：检查AI服务状态

- `POST /api/agent/run`：调用AI智能功能

### 4\. 错误统一处理

如果Python服务挂了、请求超时、参数错误，Nest都会返回统一格式的报错，**前端不用单独处理各种异常**，体验更友好。

---

## 七、完整请求流程（从头到尾）

1\. 用户在前端选择功能、输入问题
2\. 前端自动组装当前数据库、数据表信息
3\. 前端请求NestJS接口
4\. Nest校验参数，转发给Python LangGraph服务
5\. Python拼接提示词，调用大模型
6\. 大模型返回结果，Python整理数据
7\. Nest统一封装结果，返回给前端
8\. 前端展示AI回答

---

## 八、本地调试命令（直接复制即用）

**启动Python AI服务**

```Plain Text
cd agent-service
uv run uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

**启动Nest后端**

```Plain Text
cd backend
npm run start:dev
```

**测试服务是否通**

```Plain Text
# 测试Python服务
curl http://127.0.0.1:8000/health

# 测试Nest转发
curl http://127.0.0.1:3000/agent/health
```

---

## 九、新手总结（核心重点）

1\. **分层思想**：Nest负责业务转发，Python负责AI计算，各司其职，好维护、好扩展
2\. **LangGraph作用**：提供统一的状态管理，让AI逻辑结构化，后续新增功能不用重构
3\. **安全设计**：AI只做文字分析和代码生成，不操作真实数据库，零风险
4\. **极简扩展**：后续想加SQL优化、数据问答、批量生成语句等功能，只需要新增LangGraph节点即可

这套架构非常适合新手学习AI工程化，既能跑通业务，又能掌握LangGraph基础用法，可直接用于毕业设计、项目实战、二次开发！

