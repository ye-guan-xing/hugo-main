---
draft: false
date: 2025-12-05 17:36:00 +08:00 
title: "校园OJ项目的整体结构"
categories: ["校园OJ开发", "web开发"]
tags: ["前端开发"]
---

## 引言（为什么写这个?）

在完成全域生活服务平台后，我对前后端协同开发的流程有了更深入的理解。但一直想挑战一个更贴近编程学习场景的项目——在线判题系统（OJ，Online Judge）。这类平台不仅需要清晰的用户交互设计，还涉及代码提交、实时判题、数据统计等复杂业务逻辑，非常适合用来巩固前端工程化思想。

本次分享将聚焦前端开发细节，包括项目架构设计、核心功能实现及业务流程梳理。后端部分由好友 shuimo 负责搭建，后续若有机会会邀请他补充后端架构细节。

> 先放一张完整的项目架构图，帮助大家建立整体认知：

下面是校园 OJ 平台前端项目的完整目录结构，这个结构体现了现代 Vue 项目的模块化设计思想：

```tree
src/
├── api/                     # 接口请求封装目录（与后端交互）
│   ├── admin.js             # 管理员相关接口（登录、权限、题目管理等）
│   ├── problem.js           # 题目相关接口（列表、详情、增改等）
│   ├── submission.js        # 提交记录相关接口（提交代码、历史、结果等）
│   └── users.js             # 用户相关接口（注册、登录、信息等）
├── assets/                  # 静态资源目录（样式、图片等）
│   ├── css/
│   │   └── login.css        # 登录页面专属样式文件
│   ├── images/              # 图片资源存放目录
│   └── styles/
│       ├── common.scss      # 全局通用样式
│       └── variables.scss   # 样式变量（颜色、尺寸等）
├── components/              # 公共组件目录（可复用）
│   ├── admin/
│   │   ├── ProblemForm.vue  # 管理员端题目表单组件（新增/编辑题目）
│   │   └── ProblemManagement.vue # 管理员端题目管理组件（列表、操作）
│   ├── common/
│   │   ├── AppFooter.vue    # 全局页脚组件
│   │   └── AppNavbar.vue    # 全局导航栏组件
│   ├── problem/
│   │   ├── ProblemDetail.vue # 题目详情展示组件
│   │   ├── ProblemItem.vue  # 题目列表项组件（单个题目展示）
│   │   └── ProblemTags.vue  # 题目标签组件（展示/选择标签）
│   └── submission/
│       ├── CodeEditor.vue   # 代码编辑器组件（提交代码用）
│       ├── SubmissionItem.vue # 提交记录项组件（单个提交展示）
│       └── SubmissionList.vue # 提交记录列表组件
├── layouts/                 # 布局组件目录
│   └── MainLayout.vue       # 主布局组件（包含导航、页脚，包裹页面内容）
├── router/                  # 路由配置目录
│   ├── index.js             # 路由入口（创建路由实例、挂载等）
│   └── routes.js            # 路由规则定义（页面路由映射）
├── store/                   # Vuex状态管理目录
│   ├── modules/
│   │   ├── problem.js       # 题目相关状态管理（数据、操作）
│   │   ├── submission.js    # 提交相关状态管理（数据、操作）
│   │   └── user.js          # 用户相关状态管理（登录态、信息等）
│   ├── getters.js           # Vuex全局计算属性（公共状态获取）
│   └── index.js             # Vuex入口（创建store实例、注册模块等）
├── utils/                   # 工具函数目录（通用功能）
│   ├── auth.js              # 权限认证工具（token存储、验证等）
│   ├── constant.js          # 常量定义（接口地址、状态码等）
│   ├── format.js            # 数据格式化工具（时间、字符串等）
│   ├── mockData.js          # 模拟数据（开发测试用）
│   └── request.js           # 请求封装（axios拦截、配置等）
├── views/                   # 页面视图目录（路由对应页面）
│   ├── admin/
│   │   ├── ProblemEdit.vue  # 管理员端题目编辑页面
│   │   └── ProblemManagement.vue # 管理员端题目管理页面
│   ├── login/
│   │   └── AppLogin.vue     # 登录页面
│   ├── problem/
│   │   ├── ProblemDetailView.vue # 题目详情页面（基于ProblemDetail组件）
│   │   └── ProblemList.vue  # 题目列表页面
│   ├── submission/
│   │   └── SubmissionHistory.vue # 提交历史页面
│   ├── user/
│   │   └── AppHome.vue      # 用户首页
│   ├── NotFound.vue         # 404页面（路由匹配失败展示）
│   └── App.vue              # 根组件（应用入口页面容器）
└── main.js                  # 项目入口文件（创建Vue实例、挂载等）
```

这个架构清晰地将项目分为 10 个核心模块，每个模块都有明确的职责边界，确保了代码的可维护性和可扩展性。

## 技术栈解析

### 核心技术框架

- **Vue 3** - 渐进式 JavaScript 框架，负责整个应用的核心逻辑和 UI 渲染
- **Vue Router** - 官方路由管理器，处理页面导航和权限控制
- **Vuex** - 状态管理模式，管理全局共享数据
- **Element Plus** - UI 组件库，提供丰富的预制界面元素

### 开发工具链

- **Vue CLI** - 项目脚手架，快速初始化标准化项目结构
- **npm** - 包管理器，管理项目依赖和构建脚本
- **SCSS/Sass** - CSS 预处理器，提供变量、嵌套等高级功能
- **ESLint** - 代码检查工具，保证代码质量和风格统一
- **Babel** - JavaScript 编译器，确保代码兼容性

### 辅助工具库

- **Axios** - HTTP 客户端，处理网络请求和数据交互
- **Vue I18n** (可选) - 国际化支持
- **Vite** (可选) - 下一代前端构建工具，提供更快开发体验

## 各模块深度解析

### api/ - 网络通信枢纽

这个模块是前端与后端之间的**通信桥梁**。它将 HTTP 请求封装成语义化的函数，让业务代码无需关心底层网络细节。

- **admin.js** - 管理员专属接口网关，处理题目管理、权限控制等高阶操作
- **problem.js** - 题目数据接口，提供题目列表查询、详情获取等服务
- **submission.js** - 提交记录服务，处理代码提交、评测结果查询
- **users.js** - 用户身份服务，管理登录、注册和个人信息

**设计理念**：每个文件对应一个后端服务领域，通过统一的请求拦截器处理认证、错误等通用逻辑。

### assets/ - 静态资源仓库

这里是项目的**视觉资产库**，存放所有非代码资源。

- **css/login.css** - 登录页专属样式，实现特殊视觉效果
- **images/** - 图片资源中心，管理 logo、图标、背景图等
- **styles/variables.scss** - 设计令牌系统，定义颜色、间距、字体等设计常量
- **styles/common.scss** - 全局样式基础，包含重置样式、工具类、布局框架

**设计理念**：通过 CSS 变量和混合宏实现主题可配置性，支持白天/黑夜模式切换。

### components/ - 可复用组件工厂

这个模块采用**乐高积木**式的设计思想，每个组件都是独立、可复用的 UI 单元。

- **common/** - 基础设施组件

  - AppNavbar：全局导航系统，根据用户权限动态显示菜单
  - AppFooter：版权信息展示区，包含网站信息和外部链接

- **problem/** - 题目相关组件套件

  - ProblemDetail：题目展示器，渲染题目描述、示例和难度信息
  - ProblemItem：题目卡片，在列表中展示题目的核心信息
  - ProblemTags：标签管理系统，支持标签展示和筛选

- **admin/** - 管理后台组件集

  - ProblemForm：题目编辑器，提供富文本编辑和测试用例配置
  - ProblemManagement：题目控制面板，支持批量操作和高级搜索

- **submission/** - 代码提交组件包
  - CodeEditor：代码编辑器，提供语法高亮和智能提示
  - SubmissionItem：提交记录卡片，显示评测状态和时间消耗
  - SubmissionList：提交历史视图，支持分页和过滤

**设计理念**：组件遵循单一职责原则，通过 Props 和 Events 与父组件通信，支持深度定制。

### layouts/ - 页面布局框架

**MainLayout.vue** 是应用的骨架系统，定义了页面的基本结构：

- 顶部：导航栏区域
- 中部：动态内容区域
- 底部：页脚信息区域

这个布局被大多数页面复用，确保用户体验的一致性。

### router/ - 应用导航系统

路由模块是应用的**GPS 导航系统**，管理着所有页面的访问路径。

- **routes.js** - 路线图数据库，定义了 URL 到页面的映射关系
- **index.js** - 导航控制中心，包含权限守卫和路由钩子

**权限分级**：

- 公共路由：无需登录即可访问（首页、题目列表）
- 用户路由：需要登录凭证（提交记录、个人中心）
- 管理员路由：需要管理员权限（题目管理、用户管理）

### store/ - 全局状态管理中心

这里是应用的**中央数据中心**，采用模块化设计管理全局状态。

- **modules/user.js** - 用户状态库，管理登录态、权限信息和个人数据
- **modules/problem.js** - 题目状态库，缓存题目列表和详情数据
- **modules/submission.js** - 提交状态库，跟踪提交历史和评测结果
- **getters.js** - 数据查询接口，提供便捷的状态访问方法
- **index.js** - 状态库入口，集成所有模块并提供插件支持

**数据流**：组件 → Actions → Mutations → State → 组件

### utils/ - 工具函数库

工具库是项目的**瑞士军刀**，提供各种通用功能。

- **request.js** - HTTP 请求引擎，封装 Axios 并提供拦截器
- **auth.js** - 身份验证工具，管理 Token 的存储和验证
- **constant.js** - 常量字典，集中管理接口地址、状态码等
- **format.js** - 数据格式化器，统一日期、数字等展示格式
- **mockData.js** - 模拟数据生成器，支持离线开发和测试

### views/ - 页面视图层

视图层是用户直接交互的界面，每个页面都是路由的终点。

- **login/** - 身份验证门户

  - AppLogin.vue：登录注册一体化页面，支持第三方登录

- **problem/** - 题目浏览区

  - ProblemList.vue：题目目录页，支持搜索和筛选
  - ProblemDetailView.vue：题目详情页，集成代码编辑器

- **submission/** - 提交记录区

  - SubmissionHistory.vue：个人提交历史，支持状态过滤

- **admin/** - 管理控制台

  - ProblemManagement.vue：题目管理面板
  - ProblemEdit.vue：题目编辑界面

- **user/** - 个人空间

  - AppHome.vue：个人主页，展示统计信息和活动记录

- **NotFound.vue** - 404 错误页面，提供友好的错误提示

### 核心入口文件

- **App.vue** - 应用根容器，定义全局样式和基础结构
- **main.js** - 应用启动器，集成所有插件并挂载到 DOM
