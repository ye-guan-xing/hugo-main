---
draft: false
date: 2026-02-13 16:36:00 +0800
title: "前端学习路线：从入门到进阶"
categories: ["学习路线"]
---

## 前言

这份前端学习路线源自 [roadmap.sh](http://roadmap.sh)，是一份被全球开发者广泛参考的学习指南。它清晰地梳理了从基础到进阶的所有核心知识点，并标注了每个内容的学习优先级，帮助你在浩瀚的前端知识海洋中找准方向，高效学习。（参考图见尾部）

---

## 图例说明

在开始之前，请先了解图中标记的含义，这将帮助你判断学习的优先级：

- **❤️ 个人推荐 / 意见**：**核心必学内容**，是前端开发的基石，必须掌握。
- **✅ 替代选项 — 选择此项或是紫色项目**）：**选其一深入即可**，通常是不同的技术方案或框架，无需全部学习。
- **☑ 不必严格按照路线图的顺序（随时可学）**：**可灵活安排学习顺序**，属于进阶或补充性知识。
- **⚫ 我不推荐**：**优先级较低或可跳过**，在当前技术环境下必要性不高。

---

## 一、互联网基础 🌐

在学习具体的前端技术之前，理解互联网的工作原理至关重要，这能帮你建立起坚实的知识根基。

- ❤️ 互联网是如何运作的？
- ❤️ 什么是 HTTP？
- ❤️ 浏览器及其工作原理？
- ❤️ DNS 及其工作原理？
- ❤️ 什么是域名 (Domain Name)？
- ❤️ 什么是主机托管 (Hosting)？

---

## 二、HTML 🏗️

HTML 是网页的骨架，负责定义内容的结构和语义。

- ✅ 学习基础知识
- ❤️ 撰写语义化 (Semantic) HTML
- ❤️ 表单 (Form) 和验证 (Validation)
- ❤️ 惯例和最佳实践 (Best Practice)
- ☑ 无障碍 (Accessibility)
- ☑ 基础的搜索引擎优化 (SEO)

---

## 三、CSS 🎨

CSS 负责网页的视觉呈现，让你的页面变得美观和响应式。

- ✅ 学习基础知识
- ✅ 制作页面布局 (Layout)
- ✅ 响应式设计\* 和 媒体查询\*\*
  - ❤️ 浮动 (Float)
  - ❤️ 定位 (Positioning)
  - ❤️ 显示属性 (Display)
  - ❤️ 盒模型 (Box Model)
  - ❤️ CSS 网格 (Grid)
  - ❤️ 弹性盒子 (Flex Box)
  - Responsive Design，也译作“响应式网页设计”
  - \*Media Query，媒体查询是实现响应式设计的核心技术

---

## 四、JavaScript 💻

JavaScript 是前端的灵魂，赋予网页交互和动态能力。

- ❤️ 语法和基本结构
- ❤️ 学习 DOM 操作
- ❤️ 了解 Fetch API / Ajax (XHR)
- ❤️ ES6+ 及模块化 JavaScript
- ❤️ 理解提升 (Hoisting)、事件冒泡 (Event Bubbling)、作用域 (Scope)、原型 (Prototype)、影子 (Shadow) DOM、严格模式 (Strict) 等核心概念
  - “作用域 (Scope)”也有译作“范畴”的情况，前端领域通用译法为“作用域”

---

## 五、工具与工程化 🛠️

现代前端开发离不开各种工具，它们能极大地提升你的开发效率和代码质量。

### 版本控制系统 (VCS)

- ☑ 版本控制系统的定义及使用价值
- ❤️ Git 基本用法
- ☑ 代码仓库托管 (Repo Hosting) 服务
  - ✅ 注册账号并学习使用 GitHub
  - ❤️ GitHub
  - ☑ GitLab
  - ☑ Bitbucket

### 包管理系统

- ❤️ npm
- ❤️ yarn
- ☑ 补充说明：npm 和 yarn 功能相近，选择其一或两者都学均可，无本质差异

### 网络安全知识

- ☑ 至少掌握以下内容的基础概念
  - ☑ HTTPS
  - ☑ 内容安全政策 (CSP)
  - ☑ 跨域资源共享 (CORS)
  - ☑ OWASP 安全风险（Web 应用程序常见安全漏洞）

### CSS 架构 (Architecture)

- ☑ 补充说明：现代框架和 CSS-in-JS 普及后，无需深入钻研这类架构，但熟悉 BEM 仍有价值
  - ✅ BEM（Block-Element-Modifier，一种 CSS 命名规范）
  - ⚫ OOCSS（面向对象的 CSS）
  - ⚫ SMACSS（可扩展的模块化 CSS）

### CSS 预处理器 (Preprocessor)

- ☑ 补充说明：随着现代框架发展，CSS-in-JS 逐渐成为主流，这类预处理器非必需，但熟悉基础仍有帮助
  - ❤️ Sass（含 SCSS 语法）
  - ☑ PostCSS
  - ⚫ Less

### 任务执行器 (Task Runner)

- ❤️ npm scripts
- ⚫ Gulp

### 模块打包工具 (Module Bundler)

- ❤️ Webpack
- ☑ Rollup
- ☑ Parcel

### 代码检查与格式化工具

- 一种静态代码分析工具，用于检测代码语法错误、规范问题
  - ❤️ ESLint
- ❤️ Prettier
- ⚫ StandardJS

---

## 六、前端框架与库 📚

框架和库能帮你快速构建复杂的单页应用 (SPA)，选择一个深入学习是进阶的关键。

### 选择一款框架 (Framework)

- ❤️ React.js
  - ❤️ Redux（状态管理库）
  - ❤️ MobX（替代 Redux 的状态管理库）
- ✅ Angular
  - ❤️ RxJS（响应式编程库）
  - ❤️ NgRx（Angular 生态的状态管理库）
- ✅ Vue.js
  - ❤️ VueX（Vue 生态的状态管理库）

### 现代 CSS 方案

- ❤️ Styled Components
- ❤️ CSS Modules
- ❤️ Styled JSX
- ❤️ Emotion
- ⚫ Radium
- ⚫ Glamorous

### Web 组件 (Web Component)

- ☑ HTML 模板 (Template)
- ☑ 自定义元素 (Custom Elements)
- ☑ 影子 (Shadow) DOM

### CSS 框架 (Framework)

- 基于 JS 的 CSS 框架（适配 JS 应用程序）：
  - ❤️ Reactstrap（适配 React 的 Bootstrap 组件）
  - ❤️ Material UI
  - ❤️ Tailwind CSS
  - ❤️ Chakra UI
- 纯 CSS 优先的框架（默认不含 JS 组件）：
  - ❤️ Bootstrap
  - ❤️ Materialize CSS
  - ❤️ Bulma

---

## 七、测试与质量保障 ✅

写出高质量、可维护的代码，测试是必不可少的一环。

- ☑ 理解单元测试 (Unit Test)、集成测试 (Integration Test)、功能测试 (Functional Test) 的区别，并学习使用以下工具编写测试：
  - ❤️ Jest
  - ❤️ react-testing-library
  - ❤️ Cypress
  - ❤️ Enzyme
  - ☑ Mocha
  - ☑ Chai
  - ☑ Ava
  - ☑ Jasmine
- ☑ 补充说明：以上工具可满足各类测试需求，无需全部掌握，按需选择即可

---

## 八、进阶与拓展 🚀

当你掌握了基础和框架后，可以向更广阔的领域拓展。

### 渐进式网页应用程序 (PWA\*)

- Progressive Web App，渐进式网页应用，可实现类原生应用的体验
  - ❤️ Storage（存储 API）
  - ❤️ Web Sockets（网络通信 API）
  - ❤️ Service Workers（离线缓存核心）
  - ❤️ Location（地理位置 API）
  - ❤️ Notifications（通知 API）
  - ❤️ Device Orientation（设备方向 API）
  - ❤️ Payments（支付 API）
  - ❤️ Credentials（凭证 API）
- ☑ 补充说明：需了解 PWA 中涉及的各类 Web API 基础用法

### 性能优化

- ☑ PRPL 模式 (Pattern)（前端加载性能优化模式）
- ☑ RAIL 模型 (Model)（以用户体验为核心的性能评估模型）
- ☑ 性能指标\* (Performance Metric)
  - 如 LCP、FID、CLS 等核心 Web 性能指标
- ☑ 使用 Lighthouse（Chrome 内置性能检测工具）
- ☑ 使用浏览器开发者工具 (DevTool)
- ☑ 计算、测量并优化应用性能

### 类型检查工具 (Type Checker)

- ❤️ TypeScript
- ⚫ Flow

### 服务器端渲染 (Server Side Rendering, SSR)

- ❤️ React.js 生态：
  - ❤️ Next.js
  - ⚫ After.js
- ✅ Angular 生态：
  - ☑ Universal
- ✅ Vue.js 生态：
  - ❤️ Nuxt.js

### GraphQL

- ❤️ Apollo（GraphQL 客户端/服务端框架）
- ❤️ Relay Modern（React 生态的 GraphQL 框架）

### 移动端应用开发

- ❤️ React Native（基于 React 的跨平台原生应用框架）
- ☑ NativeScript（跨平台原生应用框架）
- ☑ Flutter（Google 推出的跨平台 UI 框架）
- ☑ Ionic（基于 Web 技术的混合应用框架）

### 桌面端应用开发

- ❤️ Electron（基于 Web 技术的跨平台桌面应用框架）
- ⚫ Carlo（轻量级桌面应用框架）
- ⚫ Proton Native（类 React Native 的桌面应用框架）

### 静态网站生成器 (Static Site Generator)

- ☑ Next.js
- ☑ GatsbyJS（React 生态）
- ☑ Nuxt.js（Vue 生态）
- ☑ Vuepress（Vue 生态文档生成工具）
- ☑ Jekyll（Ruby 开发的静态生成器）
- ☑ Hugo（Go 开发的高性能静态生成器）
- ☑ Gridsome（Vue 生态，类似 Gatsby）

### Web Assembly

- ☑ 补充说明：Web Assembly（简称 WASM）是由高级语言（如 Go、C、C++、Rust）编译生成的二进制指令集，运行速度远超 JavaScript。WASM 1.0 已被主流浏览器支持，W3C 于 2019 年底将其列为官方标准，但距离全面普及仍需时间。

---

## 九、持续学习 📖

前端技术日新月异，这份路线图只是一个起点。保持好奇心，持续学习新的特性、工具和最佳实践，才能在这个领域不断进步。

---

## 图

- ![前后端通用](/images/前后端学习路线/intro.png)
- ![前端](/images/前后端学习路线/frontend.png)

## 信息来源

- 台湾正体中文翻译原作者：goodjack/developer-roadmap-chinese / littlegoodjack
- 路线图完整版及更多资源：[http://roadmap.sh](http://roadmap.sh)
