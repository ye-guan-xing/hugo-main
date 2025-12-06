---
draft: false
date: 2025-12-05 18:36:00 +08:00
title: "校园OJ项目的详细开发(登录界面)"
categories: ["校园OJ开发", "web开发"]
tags: ["前端开发"]
---

# 手把手教你理解校园 OJ 登录系统：从输入密码到进入首页

## 一、前言：登录系统的“三件套”

想象一下你要进宿舍楼：

1. **门禁卡**（token） - 证明你是楼里的学生
2. **保安**（路由守卫） - 检查你有没有门禁卡
3. **楼长**（Vuex） - 登记你的入住信息

我们的登录系统就是这样的三级验证机制！

## 二、核心模块详解

### 1. Token 管理系统 - `auth.js`（你的电子门禁卡）

这个文件专门管理你的“门禁卡”（token）：

```javascript
// 就像宿舍楼的门禁系统
const TOKEN_KEY = "oj_user_token"; // 门禁卡的编号

// 进门时刷卡（获取token）
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// 办新卡（设置token）
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// 卡丢了/毕业了（移除token）
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// 检查有没有卡（是否已登录）
export function isAuthenticated() {
  return !!getToken(); // !!就是把任何值变成true/false的魔法
}
```

**比喻理解**：

- `localStorage` = 你的钱包，专门放重要卡片
- `TOKEN_KEY` = 卡包里的特定卡槽，只放门禁卡
- 每次进出，保安只看这个卡槽有没有卡

### 2. 通信专员 - `request.js`（你的专属信使）

这个文件负责和**后端服务器**对话，就像你有个专属信使：

```javascript
import axios from "axios"; // 信使工具包
import { getToken, removeToken } from "./auth"; // 带上/退回门禁卡
import { ElMessage } from "element-plus"; // 消息提示喇叭

// 招募一个专属信使
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || "/api", // 服务器地址
  timeout: 10000, // 10秒没回复就算超时
});

// 【出发前的准备】请求拦截器 - 信使出发前做的事
request.interceptors.request.use((config) => {
  const token = getToken(); // 从钱包拿出门禁卡
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`; // 把卡挂在脖子上
  }
  return config; // 可以出发了！
});

// 【回来后的处理】响应拦截器 - 信使回来后做的事
request.interceptors.response.use(
  (response) => {
    const res = response.data; // 打开信封
    if (res.code === 1) {
      // 如果信上说"一切正常"
      return res.data; // 把真正的内容给你
    } else {
      // 信上说"有问题"
      ElMessage.error(res.message || "请求失败"); // 用喇叭广播问题
      throw new Error(res.message || "请求失败"); // 抛出问题
    }
  },
  (error) => {
    // 信使自己出问题了（网络错误）
    const { status } = error.response || {};

    switch (status) {
      case 401: // 门禁卡过期
        ElMessage.error("登录已过期，请重新登录");
        removeToken(); // 扔掉过期卡
        if (window.location.pathname !== "/login") {
          window.location.href = "/login"; // 赶回登录处重新办卡
        }
        break;
      case 403: // 权限不足
        ElMessage.error("没有权限访问");
        break;
      default:
        ElMessage.error("网络错误");
    }

    throw error; // 把问题继续上报
  }
);
```

**信使工作流程图**：

```
你要发信 → 信使出发前（拦截器）→ 检查带没带门禁卡 → 出发送信
         ↓
服务器回信 → 信使回来后（拦截器）→ 检查信的内容 → 正常就给你，异常就广播
```

### 3. 用户服务接口 - `user.js`（能办的四件事）

这个文件定义了你能让信使办的**四件事**：

```javascript
import request from "@/utils/request"; // 调用刚才的信使

// 1. 办门禁卡（登录）
export function login(data) {
  return request({
    url: "/user/login", // 去"办卡处"
    method: "post", // 用"申请"的方式
    data, // 带上身份证明（账号密码）
  });
}

// 2. 注册新身份（注册）
export function register(data) {
  return request({
    url: "/user/register", // 去"登记处"
    method: "post",
    data,
  });
}

// 3. 更新个人信息（修改资料）
export function updateUserInfo(data) {
  return request({
    url: "/user/info", // 去"资料修改处"
    method: "put", // 用"修改"的方式
    data,
  });
}

// 4. 注销门禁卡（退出登录）
export function logout() {
  return request({
    url: "/user/logout", // 去"注销处"
    method: "post",
  });
}

// 5. 查看个人档案（获取用户信息）
export function getUserInfo() {
  return request({
    url: `/user/stats`, // 去"档案室"
    method: "get",
  });
}
```

**通俗理解**：

- 每个`export function`就像一张**办事指南**
- `request()`就是**让信使按指南办事**
- 返回值是一个**Promise**（承诺书），承诺会给你结果

### 4. 用户管理中心 - `user.js (store/modules)`（楼长的登记簿）

这里是 Vuex 的**用户模块**，负责管理所有用户相关的全局状态：

```javascript
// 【状态仓库】楼长手里的登记簿
const state = {
  token: getToken(), // 当前有效的门禁卡
  userInfo: null, // 住户的详细信息
};

// 【修改规则】楼长能做的修改操作
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token; // 登记新卡
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo; // 登记住户信息
  },
  CLEAR_USER: (state) => {
    state.token = ""; // 注销卡片
    state.userInfo = null; // 清除住户信息
    removeToken(); // 从钱包里也扔掉
  },
};

// 【办事流程】楼长处理事务的流程
const actions = {
  // 办理入住（登录）
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      // 情况1：模拟模式（开发时用）
      if (useMock) {
        if (用户名密码正确) {
          commit("SET_TOKEN", "临时卡"); // 发临时卡
          commit("SET_USER_INFO", { 角色: "管理员" }); // 登记信息
          resolve(); // 办好了！
        } else {
          reject("密码错了"); // 办不了
        }
      }

      // 情况2：真实模式（实际上线用）
      else {
        apiLogin(userInfo).then((响应) => {
          if (响应.成功) {
            commit("SET_TOKEN", 响应.token); // 发正式卡
            commit("SET_USER_INFO", 响应.用户信息); // 登记信息
            resolve(); // 办好了！
          }
        });
      }
    });
  },

  // 查看住户档案（获取用户信息）
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (!state.token) {
        reject("你没卡啊！"); // 没卡看什么档案
        return;
      }

      // ...获取信息的逻辑
    });
  },

  // 办理退宿（退出登录）
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      // 1. 通知服务器我要走了
      apiLogout().then(() => {
        // 2. 本地也清理
        commit("CLEAR_USER");
        resolve();
      });
    });
  },
};
```

**Vuex 核心概念**（必须理解！）：

- `state` = 当前的状态（现在有什么）
- `mutations` = 能做什么修改（只能通过这里改！）
- `actions` = 做事的流程（可以包含异步操作）

**修改状态的标准流程**：

```
你要改数据 → 调用action → action调用mutation → mutation修改state
```

### 5. 快捷访问门 - `getters.js`（快速查询通道）

这个文件提供**快速查询**状态的方法：

```javascript
const getters = {
  token: (state) => state.user.token, // "给我当前的门禁卡"
  userInfo: (state) => state.user.userInfo, // "给我住户信息"
  isLogin: (state) => !!state.user.token, // "告诉我有没有卡"（!!转布尔值）
};
```

**为什么需要 getters**？

- 就像图书馆的**查询机**，不用自己去书库翻
- 统一的查询接口，避免拼写错误
- 可以计算衍生数据（如`isLogin`）

### 6. Vuex 总仓库 - `index.js`（所有登记簿的集合）

这里是 Vuex 的**入口文件**，整合所有模块：

```javascript
import { createStore } from "vuex";
import getters from "./getters";
import user from "./modules/user";

export default createStore({
  modules: {
    user, // 用户登记簿
    // problem,  题目登记簿（可以后续添加）
    // submission, 提交记录登记簿
  },
  getters, // 快速查询通道
});
```

**模块化设计的好处**：

- 用户数据放`user`模块
- 题目数据放`problem`模块
- 提交记录放`submission`模块
- 互不干扰，清晰明了

### 7. 登录页面 - `AppLogin.vue`（前台接待处）

这是用户看到的**登录界面**：

```vue
<template>
  <div class="login-container">
    <div class="login-card">
      <!-- 标题区域 -->
      <div class="login-header">
        <h2>OJ平台登录</h2>
      </div>

      <!-- 表单区域 -->
      <el-form @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="formData.username" placeholder="用户名" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="formData.password" type="password" />
        </el-form-item>

        <el-form-item>
          <el-button @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

// 获取工具
const router = useRouter(); // 导航员（负责跳转页面）
const route = useRoute(); // 当前路线信息
const store = useStore(); // 楼长（Vuex）

// 表单数据
const formData = reactive({
  username: "",
  password: "",
});

// 登录函数
const handleLogin = async () => {
  try {
    // 1. 找楼长办卡（调用Vuex的login）
    await store.dispatch("user/login", {
      username: formData.username,
      password: formData.password,
    });

    // 2. 办卡后登记详细信息（调用getInfo）
    const userInfo = await store.dispatch("user/getInfo");

    // 3. 欢迎入住！
    ElMessage.success(`欢迎回来，${userInfo.username}！`);

    // 4. 导航员带你去想去的地方
    const redirect = route.query.redirect || "/home";
    router.push(redirect);
  } catch (error) {
    // 出错了，喇叭广播
    ElMessage.error(error.message);
  }
};
</script>
```

**页面组件关键点**：

- `useRouter()` - 获取导航员，用于页面跳转
- `useStore()` - 获取楼长，用于状态管理
- `store.dispatch()` - 让楼长办事（异步操作）
- `router.push()` - 让导航员带路

## 三、完整登录流程（故事版）

让我们跟着"小明"走一遍完整流程：

### 第一幕：来到登录页面

小明打开浏览器，输入 OJ 平台网址，看到登录页面（`AppLogin.vue`）。

### 第二幕：填写信息

小明输入：

- 用户名：`xiaoming`
- 密码：`123456`

### 第三幕：点击登录按钮

```javascript
// 发生的事：
1. 页面调用 handleLogin()
2. 找楼长（store）："帮我办卡！"
3. 楼长查看登记簿（state），发现没卡
4. 楼长派信使（request）去服务器办卡
```

### 第四幕：信使出发

```javascript
// request.js 的工作：
1. 信使出发前检查："带门禁卡了吗？" → 没带（第一次登录）
2. 出发去服务器（baseURL + "/user/login"）
3. 带上小明的账号密码（data）
```

### 第五幕：服务器验证

```javascript
// 服务器的工作：
1. 检查账号密码
2. 正确：生成一张门禁卡（token）
3. 返回：{ code: 1, data: { token: "abc123", userInfo: {...} } }
4. 错误：返回 { code: 0, message: "密码错误" }
```

### 第六幕：信使归来

```javascript
// request.js 的响应拦截器：
1. 打开信封看code
2. code=1：把data给页面
3. code=0：用喇叭广播"密码错误"
```

### 第七幕：楼长登记

```javascript
// user.js (store) 的login action：
1. 收到信使带回的token
2. 调用SET_TOKEN登记到簿子
3. 调用setToken存到钱包（localStorage）
4. 调用SET_USER_INFO登记用户信息
```

### 第八幕：获取完整信息

```javascript
// 登录后自动调用getInfo：
1. 楼长："刚办了卡，现在去档案室拿详细资料"
2. 派信使去/user/stats
3. 拿回完整档案（roles、permissions等）
4. 登记到簿子（SET_USER_INFO）
```

### 第九幕：页面跳转

```javascript
// AppLogin.vue 的最后：
1. 喇叭广播："欢迎回来，小明！"
2. 导航员查看："小明原来想去哪？"
3. 发现route.query.redirect是"/problems"
4. 带小明去题目列表页
```

### 第十幕：后续访问

小明第二天再访问：

```javascript
1. 进大门（打开网站）
2. 保安（路由守卫）拦截："请出示门禁卡！"
3. 小明从钱包拿出卡（getToken()）
4. 保安验证有效，放行到首页
```

## 四、关键概念精讲

### 1. 什么是 Token？

**比喻**：Token 就像酒店的房卡。

- 办入住时（登录）给你一张
- 每次进房间（访问页面）要刷卡
- 退房时（退出登录）收回
- 过期了要重新办（token 过期）

### 2. localStorage vs sessionStorage

```
localStorage（长期钱包）：
- 关浏览器还在
- 适合存token这种重要东西
- 容量大（5MB）

sessionStorage（临时口袋）：
- 关浏览器就丢
- 适合临时数据
- 同标签页共享
```

### 3. Promise 异步处理

**比喻**：叫外卖的过程

```javascript
// 点外卖（发起请求）
const 外卖 = 点餐("鱼香肉丝");

// then：外卖到了做什么
外卖.then((餐) => {
  吃(餐);
});

// catch：外卖出问题了
外卖.catch((错误) => {
  打电话投诉(错误);
});

// async/await：优雅的等外卖
async function 吃饭() {
  try {
    const 餐 = await 点餐("鱼香肉丝");
    吃(餐);
  } catch (错误) {
    打电话投诉(错误);
  }
}
```

### 4. Vuex 数据流

```
单向数据流（必须遵守！）：
组件 → dispatch Action → commit Mutation → 修改 State → 更新组件
      （做什么事）       （怎么改）        （改哪里）    （看到变化）
```

## 五、常见问题解答

### Q1：为什么登录后页面刷新，又变未登录了？

**可能原因**：

1. token 没存进 localStorage（检查`setToken`）
2. 刷新后 Vuex 的 state 重置了，但 token 还在 localStorage
3. 需要在`main.js`或`App.vue`初始化时从 localStorage 读 token

### Q2：如何实现"记住我"功能？

```javascript
// auth.js 增加
export function setToken(token, remember = false) {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token); // 长期存储
  } else {
    sessionStorage.setItem(TOKEN_KEY, token); // 会话存储
  }
}

// 登录时
await store.dispatch("user/login", {
  username,
  password,
  remember: true, // 传这个参数
});
```

### Q3：多个标签页同时登录怎么办？

```javascript
// 监听storage变化
window.addEventListener("storage", (event) => {
  if (event.key === TOKEN_KEY) {
    // token变了，同步更新Vuex
    store.commit("user/SET_TOKEN", event.newValue);
  }
});
```

### Q4：如何防止 XSS 攻击盗取 token？

**安全措施**：

1. token 设置合理过期时间
2. 使用 HttpOnly Cookie（后端设置）
3. 重要操作需要二次验证
4. 定期更换 token

## 六、登录系统架构总结

```
【三层架构】
1. 展示层（View） - AppLogin.vue
   ↓ 用户交互
2. 逻辑层（ViewModel） - Vuex (user模块)
   ↓ 状态管理
3. 服务层（Service） - request.js + user.js(api)
   ↓ 网络通信
4. 持久层（Persistence） - localStorage + auth.js
```

```
【五大模块】
1. 认证模块（auth.js）- 管卡
2. 通信模块（request.js）- 管信使
3. 接口模块（user.js api）- 管能办什么事
4. 状态模块（user.js store）- 管登记簿
5. 界面模块（AppLogin.vue）- 管用户看到什么
```

## 七、给新手的黄金法则

### 法则 1：先理解流程，再写代码

画个流程图，搞清楚"点击登录"到"进入首页"中间发生了什么。

### 法则 2：分层思考，各司其职

- auth.js：只关心 token 存哪、怎么取
- request.js：只关心怎么发请求、怎么处理响应
- store：只关心数据怎么存、怎么改
- 组件：只关心用户怎么交互、数据怎么展示

### 法则 3：错误处理要全面

每个可能出错的地方都要有应对方案：

- 网络错误
- 服务器错误
- 用户输入错误
- token 过期错误

### 法则 4：用户体验要友好

- 登录中显示 loading
- 错误提示要明确
- 成功后有反馈
- 记住用户上次操作

## 八、下一步学习方向

掌握了登录系统后，你可以继续学习：

1. **权限管理**：不同角色看到不同菜单
2. **路由守卫**：更精细的访问控制
3. **第三方登录**：微信、QQ 快速登录
4. **双因素认证**：密码+手机验证码
5. **单点登录**：一个账号通行所有系统

记住，登录系统是 Web 应用的**大门**，大门设计得好不好，直接影响用户体验和系统安全。现在你不仅知道怎么用，还知道为什么这样设计，这就是成为高级开发者的第一步！

加油，你已经掌握了现代前端登录系统的核心原理！🚀
