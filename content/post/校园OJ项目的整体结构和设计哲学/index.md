+++
date = '2025-11-24T17:44:57+08:00'
draft = true
title = '校园OJ项目的整体结构和设计哲学'
+++

## 为什么要写这 OJ 平台+项目架构图？

- 在完成全域生活服务平台后，相信大家对整个前后端开发开发流程应该都有简单一定了解了，下面我将分享
  OJ 平台的搭建和细节处理。
- 这次我将专注于前端的开发的分享，后端开发将有我的好友 shuimo 来搭建，如果有机会我会让他来分享开发经验。
- 项目架构图

```tree

src/
├── api/                     # 接口调用模块
│   ├── problem.js           # 题目相关接口
│   ├── submission.js        # 提交相关接口
│   ├── user.js              # 用户相关接口
│   └── admin.js             # 【新增】管理员专属接口（如题目/用户管理）
├── assets/                  # 静态资源
│   ├── images/              # 图片资源
│   └── styles/              # 全局样式
│       ├── common.scss      # 通用样式
│       ├── variables.scss   # 样式变量
│       └── admin.scss       # 【新增】管理员页面专属样式
├── components/              # 可复用组件
│   ├── common/              # 通用组件
│   │   ├── AppNavbar.vue       # 导航栏
│   │   ├── AppFooter.vue       # 页脚
│   │   ├── Pagination.vue      # 【新增】分页组件
│   │   └── SearchInput.vue     # 【新增】搜索输入框
│   ├── problem/             # 题目相关组件
│   │   ├── ProblemDetail.vue    # 题目详情展示
│   │   ├── ProblemItem.vue      # 题目列表项
│   │   ├── ProblemTags.vue      # 题目标签
│   │   └── ProblemForm.vue      # 【新增】题目编辑/创建表单
│   ├── submission/          # 提交相关组件
│   │   ├── CodeEditor.vue       # 代码编辑器
│   │   ├── SubmissionItem.vue   # 提交记录项
│   │   └── SubmissionList.vue   # 提交记录列表
│   └── admin/               # 【新增】管理员专属组件目录
│       ├── UserItem.vue        # 【新增】用户列表项（管理员页）
│       └── StatusFilter.vue    # 【新增】状态筛选组件（管理员页）
├── layouts/                 # 布局组件
│   ├── MainLayout.vue       # 主布局（Navbar+内容区+Footer）
│   └── AdminLayout.vue      # 【新增】管理员布局（含侧边管理菜单）
├── router/                  # 路由管理
│   ├── index.js             # 路由配置入口
│   ├── routes.js            # 公共路由规则
│   └── adminRoutes.js       # 【新增】管理员专属路由规则
├── store/                   # 状态管理 (Vuex 4)
│   ├── index.js             # Vuex实例
│   ├── getters.js           # 全局getters
│   └── modules/             # 模块
│       ├── user.js          # 用户状态
│       ├── problem.js       # 题目状态
│       ├── submission.js    # 提交状态
│       └── admin.js         # 【新增】管理员状态（如管理列表筛选条件）
├── utils/                   # 工具函数
│   ├── request.js           # axios封装
│   ├── auth.js              # 权限处理
│   ├── format.js            # 格式化工具
│   └── constant.js          # 常量定义
├── views/                   # 页面级组件
│   ├── AppHome.vue             # 主页
│   ├── NotFound.vue            # 404页面
│   ├── login/               # 登录相关页面
│   │   └── AppLogin.vue        # 登录页（核心）
│   ├── problem/             # 题目相关页面
│   │   ├── ProblemList.vue          # 题目列表页
│   │   └── ProblemDetailView.vue    # 题目详情页
│   ├── submission/          # 提交相关页面
│   │   └── SubmissionHistory.vue    # 提交历史页
│   ├── user/                # 用户相关页面
│   │   ├── UserProfile.vue        # 用户个人资料页
│   │   └── UserSetting.vue        # 【新增】用户设置页（密码/信息修改）
│   └── admin/               # 管理员专属页面
│       ├── ProblemManagement.vue    # 题目管理页
│       ├── ProblemEdit.vue          # 题目编辑/创建页
│       └── UserManagement.vue       # 【新增】用户管理页（管理员专属）
├── App.vue                  # 根组件
└── main.js                  # 入口文件
```

## 技术栈和环境

### 核心技术栈

- **Vue 3**：核心前端框架（用于构建用户界面）
- **Vue Router 4**：路由管理（控制页面跳转）
- **Vuex 4**：状态管理（存储全局共享数据，如用户信息、题目列表）
- **axios**：网络请求库（调用后端 API 接口）
- **SCSS/Sass**：CSS 预处理器（编写更简洁、可维护的样式）
- **JavaScript**：核心编程语言（ES6+ 语法）
- **HTML5/CSS3**：页面结构与基础样式

### 开发环境

- **Node.js**：运行环境（需安装，推荐 v14+）
- **npm/yarn**：包管理工具（安装项目依赖）
- **VS Code**：推荐编辑器（搭配 Vue 插件如 Vetur/Volar 提升开发效率）
- **浏览器**：Chrome/Firefox（用于调试）
- **构建工具**：Vite 或 Vue CLI（用于项目构建、开发服务器启动）

---

## 文件作用（按目录逐个分析）

先明确核心逻辑：**用户操作 → 路由跳转 → 页面（views）渲染 → 组件（components）拼接 → api 调用数据 → store 存储状态 → 视图更新**

### `api/`：接口调用模块（前端 → 后端的“通信员”）

- 每个文件对应一类功能的后端接口，比如 `problem.js` 里写“获取题目列表”“获取题目详情”的请求，`submission.js` 里写“提交代码”“获取提交记录”的请求
- 作用：统一管理所有后端接口，避免在组件里零散写请求，方便维护（比如后端接口地址变了，只改这里）
- 依赖：用 `axios` 发请求，会调用 `utils/request.js` 封装好的请求工具

### `assets/`：静态资源（项目的“素材库”）

- `images/`：放图片（比如 logo、图标、背景图）
- `styles/`：放全局样式
  - `common.scss`：通用样式（比如按钮、字体、边距的统一样式）
  - `variables.scss`：样式变量（比如主题色 `$primary-color: #42b983`，方便全局修改）
  - `admin.scss`：管理员页面专属样式（和普通页面样式隔离）
- 作用：存储项目中不会动态变化的资源，比如图片、固定样式

### `components/`：可复用组件（项目的“积木”）

- 按功能拆分目录，比如 `common/` 是所有页面都能用的通用组件，`problem/` 是题目相关的专属组件
- 例子：
  - `common/AppNavbar.vue`：顶部导航栏（每个页面都显示，包含 logo、登录按钮、用户头像）
  - `problem/ProblemItem.vue`：题目列表里的“每一行”（重复出现，所以做成组件）
  - `submission/CodeEditor.vue`：写代码的编辑器（题目详情页要用，单独做成组件）
- 作用：把重复出现的界面部分做成组件，避免重复代码，比如导航栏不用在每个页面都写一遍

### `layouts/`：布局组件（项目的“页面框架”）

- `MainLayout.vue`：普通用户的布局（包含 导航栏 + 中间内容区 + 页脚）
- `AdminLayout.vue`：管理员的布局（包含 侧边管理菜单 + 顶部栏 + 中间内容区）
- 作用：统一页面的整体结构，比如普通用户访问任何页面，都有相同的导航栏和页脚，不用每个页面都写

### `router/`：路由管理（项目的“导航地图”）

- `index.js`：路由入口（把所有路由规则组装起来，告诉 Vue 怎么跳转）
- `routes.js`：普通用户的路由（比如“主页”“题目列表”“登录页”）
- `adminRoutes.js`：管理员专属路由（比如“题目管理”“用户管理”，普通用户进不去）
- 核心逻辑：用户点击“题目列表”，路由匹配到 `/problems`，然后显示 `views/problem/ProblemList.vue` 页面
- 依赖：会用 `utils/auth.js` 判断用户是否登录、是否是管理员，控制权限（比如没登录不能进题目详情页）

### `store/`：状态管理（项目的“全局数据仓库”）

- 所有组件都能访问这里的数据，比如“当前登录的用户信息”“题目列表数据”“提交记录”
- 结构：
  - `index.js`：Vuex 实例（把所有模块组装起来）
  - `getters.js`：全局获取状态的方法（比如 `getUserInfo()` 直接拿到用户信息，不用写复杂路径）
  - `modules/`：按功能拆分模块（避免数据混乱），比如 `user.js` 存用户相关状态，`problem.js` 存题目相关状态
- 例子：用户登录成功后，把用户信息（用户名、头像、角色）存到 `store/modules/user.js` 里，然后所有页面都能通过 `store.getters.getUserInfo` 获取到这个信息

### `utils/`：工具函数（项目的“小工具库”）

- `request.js`：封装 axios（比如统一加请求头、处理错误提示、添加加载动画）
- `auth.js`：权限处理（判断用户是否登录、是否是管理员，控制路由跳转）
- `format.js`：格式化工具（比如把时间戳改成“2025-11-24 17:44”，把提交结果“AC”改成“通过”）
- `constant.js`：常量定义（比如接口地址前缀 `BASE_URL: 'http://localhost:8080/api'`，题目难度 `DIFFICULTY: { EASY: 1, MEDIUM: 2, HARD: 3 }`）
- 作用：封装常用的工具方法，避免重复代码，比如格式化时间不用在每个组件里都写一遍

### `views/`：页面级组件（项目的“具体页面”）

- 每个文件是一个完整的页面，比如 `AppHome.vue` 是主页，`ProblemList.vue` 是题目列表页
- 特点：页面里会引用 `components/` 里的组件，比如 `ProblemList.vue` 里会用 `ProblemItem`（题目项）、`Pagination`（分页）、`SearchInput`（搜索框）拼出整个页面
- 核心逻辑：页面加载时，调用 `api/` 里的接口获取数据，把数据存到 `store/` 里，然后渲染组件

### `App.vue`：根组件（项目的“根容器”）

- 所有页面都是通过这个组件渲染的，里面主要包含 `router-view`（路由视图，显示当前跳转的页面）
- 简单说：App.vue 是“容器”，路由跳转到哪个页面，`router-view` 就显示哪个页面

### `main.js`：入口文件（项目的“启动开关”）

- 初始化 Vue 实例，把 `router`（路由）、`store`（状态管理）挂载到 Vue 上，然后挂载 `App.vue` 根组件
- 代码大概长这样：

  ```javascript
  import { createApp } from "vue";
  import App from "./App.vue";
  import router from "./router";
  import store from "./store";
  import "./assets/styles/common.scss"; // 引入全局样式

  createApp(App)
    .use(router) // 使用路由
    .use(store) // 使用状态管理
    .mount("#app"); // 把 App 组件挂载到页面的 #app 元素上
  ```

- 作用：启动项目时，先执行这个文件，把所有东西组装起来，然后显示页面

---

我们来给核心业务流程解析加上具体的组件和文件名称，这样能让你更清晰地看到整个项目的运行脉络。

## 核心业务流程解析（含组件/文件名称）

### 场景 1：用户登录

1.  **用户访问项目**：用户在浏览器输入网址，`main.js` 启动应用，`router/index.js` 中的路由守卫判断用户未登录，自动跳转到登录页 `views/login/AppLogin.vue`。
2.  **用户输入并提交**：用户在 `AppLogin.vue` 的登录表单中输入用户名和密码，点击“登录”按钮。
3.  **调用登录接口**：`AppLogin.vue` 的脚本部分调用 `api/user.js` 中的 `login` 函数。
4.  **发送请求与拦截**：`api/user.js` 内部使用 `utils/request.js` 封装的 axios 实例发送 POST 请求。`request.js` 的**请求拦截器**此时还没有 Token 可以添加。
5.  **后端验证并返回 Token**：后端服务器验证账号密码正确后，返回包含 Token 的 JSON 数据。
6.  **存储 Token 和用户信息**：
    - `AppLogin.vue` 在收到成功响应后，将 Token 存入 `localStorage` 和 `store/modules/user.js` 的 `state.token` 中。
    - 紧接着，调用 `store/modules/user.js` 的 `GetUserInfo` action。
    - `GetUserInfo` action 调用 `api/user.js` 的 `getUserInfo` 函数，`request.js` 的**请求拦截器**自动从 `localStorage` 中读取 Token 并添加到请求头 `Authorization` 中。
    - 后端验证 Token 有效，返回用户信息。
    - `GetUserInfo` action 将用户信息存入 `store/modules/user.js` 的 `state.userInfo` 中。
7.  **跳转页面**：登录成功后，`AppLogin.vue` 中的代码通过 `router.push()` 跳转到用户最初想访问的页面（或主页 `views/AppHome.vue`）。
8.  **更新导航栏**：`components/common/AppNavbar.vue` 组件通过 `store.getters` 监听 `userInfo` 的变化，一旦有值，就会显示用户名和头像，隐藏“登录”按钮。

### 场景 2：用户查看题目列表

1.  **用户点击导航**：用户点击 `components/common/AppNavbar.vue` 中的“题目列表”链接。
2.  **路由守卫验证**：`router/index.js` 的路由守卫检查到 `/problems` 路由需要登录（`meta.requireAuth: true`），且 `localStorage` 中有 Token，允许跳转。
3.  **渲染页面**：路由跳转到 `views/problem/ProblemList.vue` 页面。该页面使用 `layouts/MainLayout.vue` 布局。
4.  **获取并渲染题目数据**：
    - `ProblemList.vue` 在 `onMounted` 钩子中，调用 `store/modules/problem.js` 的 `GetProblemList` action。
    - `GetProblemList` action 调用 `api/problem.js` 的 `getProblemList` 函数，携带分页和筛选参数。
    - `request.js` 的请求拦截器自动添加 Token 到请求头。
    - 后端返回题目列表数据。
    - `GetProblemList` action 将数据存入 `store/modules/problem.js` 的 `state.problemList` 和 `state.totalCount` 中。
    - `ProblemList.vue` 从 `store` 中读取 `problemList`，并使用 `v-for` 循环，通过 `components/problem/ProblemItem.vue` 组件来渲染每一道题目的信息。同时，使用 `components/common/Pagination.vue` 组件来展示和处理分页逻辑。
5.  **用户点击题目**：用户点击某个 `ProblemItem.vue` 组件。
6.  **跳转到题目详情页**：`ProblemItem.vue` 中的链接触发路由跳转，导航到 `views/problem/ProblemDetailView.vue` 页面，并携带题目 ID 参数。
7.  **渲染题目详情**：
    - `ProblemDetailView.vue` 在 `onMounted` 钩子中，根据 URL 中的 ID，调用 `store/modules/problem.js` 的 `GetProblemDetail` action。
    - 该 action 调用 `api/problem.js` 的 `getProblemDetail` 函数获取具体题目信息。
    - 数据返回后，`ProblemDetailView.vue` 渲染 `components/problem/ProblemDetail.vue`（展示题干、输入输出等）和 `components/submission/CodeEditor.vue`（供用户编写代码）。

### 场景 3：用户提交代码

1.  **用户编写并提交代码**：用户在 `components/submission/CodeEditor.vue` 中编写代码，选择编程语言后，点击“提交”按钮。
2.  **调用提交接口**：`CodeEditor.vue` 组件的提交事件触发 `store/modules/submission.js` 的 `SubmitCode` action，并传入题目 ID、代码和语言。
3.  **发送提交请求**：`SubmitCode` action 调用 `api/submission.js` 的 `submitCode` 函数。`request.js` 自动添加 Token。
4.  **处理提交结果**：
    - 后端返回提交成功的响应（可能包含一个 submissionId）。
    - `SubmitCode` action 可以将新的提交记录添加到 `store/modules/submission.js` 的 `state.submissionList` 中。
    - `CodeEditor.vue` 收到成功回调后，可能会显示提示信息，并清空编辑器或跳转到提交历史。
5.  **查看提交历史**：用户点击导航栏的“提交历史”或页面内的相关链接，路由跳转到 `views/submission/SubmissionHistory.vue`。
6.  **渲染提交记录**：
    - `SubmissionHistory.vue` 在 `onMounted` 时调用 `store/modules/submission.js` 的 `GetSubmissionHistory` action。
    - 该 action 调用 `api/submission.js` 的 `getSubmissionHistory` 函数获取该用户的所有提交记录。
    - 数据返回后，`SubmissionHistory.vue` 使用 `v-for` 和 `components/submission/SubmissionItem.vue` 组件来渲染每一条提交记录的状态（通过/失败、用时、内存等）。

通过这种方式，你可以清晰地看到一个用户操作是如何从一个组件流转到另一个组件，如何与 Vuex 和 API 交互，最终完成整个业务逻辑的。

---

## 总结

这个项目的设计哲学可以归纳为以下几点：

1.  **模块化和分离关注点 (Separation of Concerns)**：

    - 清晰地将 UI (视图)、业务逻辑 (Vuex)、API 交互 (api/) 和路由 (router/) 分开。
    - 每个文件和目录都有其明确的、单一的职责。这使得代码更易于理解、维护和测试。

2.  **组件化 (Component-Based)**：

    - UI 被拆分为一个个独立的、可复用的组件。
    - 这极大地提高了代码的复用性，减少了冗余，并使得构建复杂界面变得更加简单和高效。

3.  **数据驱动 (Data-Driven)**：

    - 应用的状态 (State) 是核心。UI 的变化是对状态变化的响应。
    - 通过 Vuex 集中管理状态，使得数据流向清晰（单向数据流），易于追踪和调试。

4.  **可扩展性和可维护性**：

    - 目录结构清晰，易于导航。
    - 新增功能（如管理员模块）时，可以在不破坏现有结构的情况下，在对应的目录（如 `views/admin`, `components/admin`）下进行开发。
    - 统一的请求封装 (`utils/request.js`) 和工具函数 (`utils/`) 使得未来的修改（如更换 API 地址、统一错误处理）变得非常方便。

5.  **关注点分离**：
    - 前端只负责展示和用户交互，后端负责业务逻辑和数据存储。
    - 这种前后端分离的模式使得前后端团队可以独立开发、测试和部署，提高了开发效率。
