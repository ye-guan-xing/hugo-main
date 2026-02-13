---
draft: false
date: 2026-02-13 17:00:00 +08:00
title: "后端学习路线：从基础到架构"
categories: ["学习路线"]
---

## 前言

这份后端学习路线源自 [roadmap.sh](http://roadmap.sh)，是全球开发者广泛参考的后端技术学习指南。它清晰梳理了从基础原理到架构设计的核心知识点，并标注了学习优先级，帮助你在后端技术体系中高效构建知识体系，避免盲目学习。（参考图见尾部）

---

## 图例说明

在开始之前，请先了解图中标记的含义，这将帮助你判断学习的优先级：

- **❤️ 个人推荐 / 意见**：**核心必学内容**，是后端开发的基石，必须掌握。
- **✅ 替代选项 — 选择此项或是紫色项目**：**选其一深入即可**，通常是不同的技术方案或框架，无需全部学习。
- **☑ 不必严格按照路线图的顺序（随时可学）**：**可灵活安排学习顺序**，属于进阶或补充性知识。
- **⚫ 我不推荐**：**优先级较低或可跳过**，在当前技术环境下必要性不高。

---

## 一、互联网基础与前端知识 🌐

后端开发离不开对互联网和前端的理解，这是构建服务的基础。

- ❤️ 互联网是如何运作的？
- ❤️ 什么是 HTTP？
- ❤️ 浏览器及其工作原理？
- ❤️ DNS 及其工作原理？
- ❤️ 什么是域名 (Domain Name)？
- ❤️ 什么是主机托管 (Hosting)？
- ✅ HTML
- ☑ CSS
- ❤️ JavaScript

---

## 二、操作系统和基础知识 💻

操作系统是后端服务运行的根基，掌握其原理能让你写出更高效、稳定的代码。

- ❤️ 终端机的使用
- ❤️ 操作系统如何运作
- ❤️ 行程管理（Process Management）
- ❤️ 执行绪（Thread）和并行（Concurrency）
- ❤️ 基础的终端机指令（grep, awk, sed, lsof, curl, wget, tail, head, less, find, ssh, kill）
- ❤️ 记忆体管理
- ❤️ 行程间通讯（IPC）
- ❤️ I/O 管理
- ❤️ POSIX 的基础认知（stdin, stdout, stderr, pipes）
- ❤️ 基础的网络概念

---

## 三、学习一门语言 📚

选择一门后端语言深入学习，理解其运行时特性（如并行、内存模型）是进阶的关键。

- ✅ Java
- ✅ C#
- ✅ PHP
- ☑ Rust
- ☑ Go
- ❤️ JavaScript
- ❤️ Python
- ✅ Ruby

---

## 四、版本控制系统 (VCS) 🛠️

现代后端开发离不开版本控制，它是团队协作和代码管理的核心工具。

- ☑ 版本控制系统的定义及使用价值
- ❤️ Git 的基本用法
- ☑ 仓库代管（Repo Hosting）服务
  - ✅ 注册账号并学习使用 GitHub
  - ❤️ GitHub
  - ☑ GitLab
  - ☑ Bitbucket

---

## 五、数据库 🗄️

数据库是后端服务存储数据的核心，关系型与 NoSQL 数据库各有适用场景。

### 关系式数据库

- ❤️ PostgreSQL
- ✅ MySQL
- ✅ MariaDB
- ☑ MS SQL
- ☑ Oracle

### NoSQL 数据库

- ❤️ 文件资料库（MongoDB, CouchDB）
- ✅ 栏位资料库（Cassandra）
- ☑ 时序型资料库（InfluxDB, TimescaleDB）
- ☑ 即时资料库（Firebase, RethinkDB）

### 更多关于资料库

- ❤️ ORM（物件关系映射）
- ❤️ ACID
- ❤️ 交易（Transaction）
- ❤️ N+1 问题
- ❤️ 资料库正规化（Normalization）
- ❤️ 索引（Index）及其运作方式
- ☑ 资料复写（Replication）
- ☑ 分片（Sharding）策略
- ☑ CAP 定理

---

## 六、学习 API 相关知识 🚀

API 是后端服务对外交互的核心，掌握不同类型的 API 设计与实现至关重要。

- ❤️ Cookie Based
- ❤️ OAuth
- ❤️ Basic Authentication
- ❤️ Token Authentication
- ❤️ JWT
- ❤️ OpenID
- ☑ SAML
- ☑ HATEOAS
- ❤️ OpenAPI 规范以及 Swagger
- ❤️ 认证（Authentication）
- ❤️ REST
- ☑ 阅读 Roy Fielding 的论文
- ☑ JSON API
- ☑ SOAP
- ❤️ gRPC

---

## 七、缓存 (Caching) 🚀

缓存是提升后端服务性能的关键手段，合理使用缓存能显著降低数据库压力。

- ❤️ Redis
- ✅ Memcached
- ☑ CDN
- ☑ 伺服器端（Server Side）
- ☑ 用户端（Client Side）

---

## 八、网络安全知识 🔒

安全是后端服务不可忽视的环节，掌握常见安全机制与风险防范是必备能力。

- ❤️ MD5 以及为什么不要使用它
- ❤️ SHA 家族
- ☑ scrypt
- ❤️ bcrypt
- ❤️ 杂凑（Hashing）演算法
- ❤️ HTTPS
- ❤️ 内容安全政策（CSP）
- ❤️ CORS
- ❤️ SSL/TLS
- ❤️ OWASP 安全风险

---

## 九、测试 (Testing) ✅

测试是保障后端服务质量的核心，不同类型的测试覆盖不同的质量维度。

- ❤️ 整合测试（Integration Testing）
- ❤️ 单元测试（Unit Testing）
- ❤️ 功能测试（Functional Testing）
- ☑ CI/CD（持续整合/持续交付）

---

## 十、设计和开发原则 📐

遵循良好的设计原则能让代码更易维护、扩展，是资深后端开发者的核心素养。

- ☑ 四人帮（GOF）设计模式
- ☑ 领域驱动设计（DDD）
- ☑ 测试驱动开发（TDD）
- ❤️ SOLID
- ❤️ KISS
- ❤️ YAGNI
- ❤️ DRY
- 搜索引擎（Search Engine）
  - ❤️ Elasticsearch
  - ✅ Solr

---

## 十一、架构模式 🏗️

架构模式决定了系统的扩展性与维护性，不同场景下选择合适的架构至关重要。

- ☑ 整合型\*（Monolithic）应用程式
- ❤️ 微服务（Microservice）
- ☑ 服务导向架构（SOA）
- ☑ CQRS 和事件来源模式
- ☑ 无伺服器（Serverless）
- \*译注：又译作单体式

---

## 十二、容器化 vs 虚拟化 (Containerization / Virtualization) 🐳

容器化技术简化了部署与环境一致性，是现代后端部署的主流方式。

- ❤️ Docker
- ⚫ rkt
- ⚫ LXC
- 讯息代理\*（Message Broker）
  - ❤️ RabbitMQ
  - ✅ Kafka
- \*译注：又译作讯息中介

---

## 十三、GraphQL 📊

GraphQL 提供了更灵活的 API 查询方式，适用于复杂数据场景的后端服务。

- ❤️ Apollo
- ✅ Relay Modern

---

## 十四、图资料库\* (Graph Database) 🗄️

图资料库擅长处理复杂的关联数据，适用于社交网络、知识图谱等场景。

- ❤️ Neo4j
- \*译注：又译作图形资料库、图数据库

---

## 十五、WebSocket 🔌

WebSocket 实现了双向实时通信，是实时应用（如聊天、直播）的核心技术。

- 缓解策略（Mitigation Strategy）
  - ☑ 从容退化（Graceful Degradation）
  - ☑ 请求频率限制（Throttle）
  - ☑ 背压（Backpressure）
  - ☑ 负载转移（Loadshifting）
  - ☑ 断路器（Circuit Breaker）
- \*译注：又译作反压

---

## 十六、网页服务器 (Web Server) 🌐

网页服务器是后端服务的入口，选择合适的服务器能提升服务性能与稳定性。

- ❤️ Nginx
- ✅ Apache
- ☑ Caddy
- ☑ MS IIS

---

## 十七、规模化建设 📈

当服务用户量增长时，规模化建设是保障服务可用性与性能的关键。

- ❤️ 迁移策略（Migration Strategy）
- ❤️ 水平 vs 垂直扩展（Horizontal vs Vertical Scaling）
- 以可观测性（Observability）为前提进行建设
  - ☑ 仪表（Instrumentation）
  - ☑ 监测（Monitoring）
  - ☑ 遥测（Telemetry）
  - ☑ 指标纪录以及其他可观测的项目
  - ☑ 可以在出错时帮助你除错和解决问题

---

## 十八、持续学习 📖

后端技术生态迭代迅速，从云原生到 Serverless，持续学习新工具与最佳实践是保持竞争力的核心。

---

## 图

- ![前后端通用](/images/前后端学习路线/intro.png)
- ![后端](/images/前后端学习路线/backend.png)

## 信息来源

- 台湾正体中文翻译原作者：goodjack/developer-roadmap-chinese / littlegoodjack
- 路线图完整版及更多资源：[http://roadmap.sh](http://roadmap.sh)
