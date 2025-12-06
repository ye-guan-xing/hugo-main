---
draft: false
date: 2025-12-06T12:36:00+08:00
title: "校园OJ开发之布局逻辑"
categories: ["web开发", 校园OJ开发]
tags: ["前端开发"]
---

# 写给小白的校园 OJ 开发详解

## 前言：为什么需要这些配置？

想象一下你要建一座房子 🏠：

- **vue.config.js** = 房子的施工图纸和施工规则
- **main.js** = 房子的地基和主要结构
- **App.vue** = 房子的外壳框架
- **router** = 房子的导航系统（房间分布图）
- **layout** = 房子的装修布局（每个房间的固定摆设）

下面我一步步拆解，保证你能完全看懂！

> 注：本文基于 Vue3 开发，如果你用的是 Vue2，请自行修改。
> 的本个项目的代码可以看这个仓库：[仓库地址](https://github.com/ye-guan-xing/Campus-OJ-Platform)

vue.config.js 这个文件告诉 Vue 项目“怎么干活”：

```javascript
// 就像给工人说：从环境变量读取接口地址，默认用"/api"
const VUE_APP_BASE_API = process.env.VUE_APP_BASE_API || "/api";

module.exports = {
  devServer: {
    port: 8081, // 开发服务器端口（房子建在8081号地皮）
    open: true, // 自动打开浏览器（房子建好自动开门）
    proxy: {
      // 配置代理：把本地/api开头的请求转发到真正的后端服务器
      "/api": {
        target: "http://real-backend.com", // 真正的后端地址
        changeOrigin: true, // 改变请求源（假装是同源的）
        pathRewrite: { "^/api": "" }, // 转发时去掉/api前缀
        ws: false, // 关闭WebSocket代理（避免冲突）
      },
    },
  },
};
```

**通俗理解**：

> 开发时，前端在`localhost:8081`运行，后端可能在`localhost:8080`或其他地方。配置代理后，前端访问`/api/user`时，会自动转发到`http://real-backend.com/user`，解决了跨域问题。

## 二、地基建设：main.js

这是整个应用的启动入口：

```javascript
// 1. 导入Vue框架（拿到建房子的工具包）
import { createApp } from "vue";

// 2. 导入三个核心模块（三大件）
import App from "./App.vue"; // 房子蓝图
import router from "./router"; // 导航系统
import store from "./store"; // 中央仓库（存数据）

// 3. 导入UI组件库（预制好的门窗、家具）
import ElementPlus from "element-plus";

// 4. 创建Vue应用实例（开始施工）
const app = createApp(App);

// 5. 安装各种功能模块
app.use(router); // 安装导航系统
app.use(store); // 安装中央仓库
app.use(ElementPlus); // 安装预制家具

// 6. 挂载到页面（把建好的房子放到#app这个地块上）
app.mount("#app");
```

**一张图看懂**：

```
浏览器打开 → main.js启动 → 创建Vue实例 →
挂载路由/状态管理/UI库 → 渲染App.vue → 显示页面
```

## 三、房子外壳：App.vue

这是最外层的容器，所有页面都装在这里：

```vue
<template>
  <!-- 这里就是一个动态展示区，根据URL显示不同页面 -->
  <router-view />
</template>

<script setup>
// 这里是空的，因为这个组件只负责"装东西"，不处理具体业务
</script>

<style lang="scss">
/* 导入全局样式（全房子通用） */
@import "@/assets/styles/variables.scss"; // 颜色/尺寸变量
@import "@/assets/styles/common.scss"; // 公共样式
</style>
```

**重要概念**：

- `<router-view />` 就像一个**幻灯片投影仪**，URL 变化时，自动切换显示的内容
- 全局样式在这里引入，所有子页面都能用这些样式

## 四、房间布局：MainLayout.vue

这是页面的通用布局模板（像酒店的标准间装修）：

```vue
<template>
  <div class="main-layout">
    <!-- 顶部导航栏（每个页面都有） -->
    <AppNavbar />

    <!-- 主要内容区（会变化的部分） -->
    <main class="content">
      <router-view />
      <!-- 这里显示具体页面 -->
    </main>

    <!-- 底部页脚（每个页面都有） -->
    <AppFooter />
  </div>
</template>
```

**布局逻辑**：

```
┌─────────────────────┐
│     导航栏 Navbar    │ ← 固定，每个页面都有
├─────────────────────┤
│                     │
│     <router-view>    │ ← 动态变化的部分
│    (当前路由页面)     │
│                     │
├─────────────────────┤
│     页脚 Footer      │ ← 固定，每个页面都有
└─────────────────────┘
```

## 五、导航系统：路由配置

### 1. 路由规则（routes.js）

这是**房间分布图**，告诉系统每个 URL 对应哪个页面：

```javascript
const routes = [
  {
    path: "/", // 访问路径
    component: MainLayout, // 用哪个布局模板
    redirect: "/home", // 重定向到首页
    children: [
      // 子路由（布局内的具体内容）
      {
        path: "home", // 实际路径：/home
        name: "Home", // 路由名字（方便跳转）
        component: () => import("@/views/AppHome.vue"), // 懒加载组件
        meta: { title: "首页" }, // 额外信息（页面标题、权限要求等）
      },
      {
        path: "problems",
        name: "ProblemList",
        component: () => import("@/views/problem/ProblemList.vue"),
        meta: { title: "题目列表" },
      },
    ],
  },
  {
    path: "/login", // 登录页不需要MainLayout布局
    component: () => import("@/views/login/AppLogin.vue"),
    meta: { title: "登录", requiresGuest: true }, // 仅游客可访问
  },
];
```

**路由类型**：

- **公共路由**：所有人可访问（首页、题目列表）
- **登录路由**：需要登录才能访问（个人中心）
- **管理员路由**：需要管理员权限（题目管理）
- **404 路由**：找不到页面时显示

### 2. 路由守卫（index.js）

这是**门口的保安**，控制谁能进哪个房间：

```javascript
router.beforeEach(async (to, from, next) => {
  // 1. 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - OJ平台`;
  }

  // 2. 检查是否登录（看有没有token）
  const hasToken = store.getters.token;

  if (hasToken) {
    // 已登录的情况
    if (to.path === "/login") {
      next("/"); // 已登录还去登录页？跳回首页！
    } else {
      // 检查是否是管理员页面
      if (to.meta.requiresAdmin && !isAdmin) {
        next("/"); // 不是管理员？滚回首页！
      } else {
        next(); // 放行！
      }
    }
  } else {
    // 未登录的情况
    if (白名单.includes(to.path)) {
      next(); // 登录页可以进
    } else {
      next(`/login?redirect=${to.path}`); // 去登录，记下来路
    }
  }
});
```

**保安的工作流程**：

```
用户访问页面 → 保安拦截 →
    ↓
判断是否登录？
    ├─ 已登录 → 想进登录页？→ 踢回首页
    │         → 想进管理页？→ 检查权限 → 放行/踢回
    │         → 进普通页 → 直接放行
    │
    └─ 未登录 → 想进登录页？→ 放行
            → 想进其他页？→ 带到登录页（记住想去哪）
```

## 六、权限控制逻辑

### 1. 路由元信息（meta 字段）

```javascript
meta: {
  title: "页面标题",
  requiresAuth: true,     // 需要登录
  requiresAdmin: true,    // 需要管理员
  requiresGuest: true     // 仅游客（未登录）
}
```

### 2. 用户角色判断

```javascript
// 从store获取用户信息
const userInfo = store.getters.userInfo;

// 判断是否是管理员
const isAdmin = userInfo.roles?.includes("admin");

// 根据角色显示不同菜单
<el-menu v-if="isAdmin">
  <el-menu-item>题目管理</el-menu-item>
</el-menu>;
```

## 七、开发流程总结

### 步骤 1：环境配置

1. 配置`vue.config.js`（代理、端口等）
2. 配置环境变量（接口地址等）

### 步骤 2：项目初始化

1. `main.js`引入核心依赖
2. `App.vue`设置路由容器和全局样式

### 步骤 3：布局设计

1. 创建`MainLayout.vue`（通用布局）
2. 设计导航栏、页脚等公共组件

### 步骤 4：路由配置

1. 在`routes.js`定义所有路由
2. 按需设置权限（public、auth、admin）
3. 在`router/index.js`配置路由守卫

### 步骤 5：页面开发

1. 在`views/`目录创建页面组件
2. 根据路由配置连接页面

### 步骤 6：权限集成

1. 登录后保存 token 到 store
2. 路由守卫根据 token 和角色控制访问
3. 页面内根据角色显示不同内容

## 常见问题解答

### Q1：为什么需要路由守卫？

A：就像学校大门，要检查学生证（登录）、权限卡（角色），防止无关人员进入。

### Q2：懒加载（() => import()）有什么好处？

A：按需加载，首次打开只下载首页代码，其他页面点到了再下载，提高首次加载速度。

### Q3：为什么 token 要存 store 而不是 localStorage？

A：store 是响应式的，组件能实时感知登录状态变化，localStorage 需要手动监听。

### Q4：如何新增一个页面？

```
1. 在views/创建组件 → 2. 在routes.js添加路由 →
3. 在导航栏添加菜单（如果需要） → 4. 测试访问
```

## 最后的小贴士

- **配置先行**：先配好路由和权限，再开发页面
- **分模块开发**：用户模块、题目模块、提交模块分开
- **权限细化**：按钮级别也要控制权限
- **错误处理**：404 页面、无权限提示要友好

记住这个开发流程，你就能搭建一个结构清晰、权限分明的校园 OJ 系统了！加油 💪
