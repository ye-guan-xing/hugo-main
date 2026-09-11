---
draft: false
date: 2026-09-11 10:00:00 +08:00
slug: "ssr-mock-simple-implementation"
title: "SSR 与 Mock 的简单实现"
categories: ["Node.js", "工程化"]
tags: ["Node.js", "工程化", "SSR", "Mock", "Express"]
---

这篇把 SSR 和 Mock 两个场景动手做掉。它们同样是"一个 Node 服务"就能讲清楚的事。

## 一、SSR:服务端渲染

### SSR 是什么

SSR(Server-Side Rendering)指**页面 HTML 由服务端生成**,而不是浏览器里用 JS 现拼。

| | CSR(客户端渲染) | SSR(服务端渲染) |
| --- | --- | --- |
| HTML 来源 | 浏览器执行 JS 后生成 | 服务端直接返回完整 HTML |
| SEO | 爬虫拿到空壳,不友好 | 爬虫直接看到内容 |
| 首屏速度 | 先下 JS 再渲染,慢 | HTML 直达,首屏快 |
| 交互 | 天然支持 | 需要"水合(hydration)"再接管 |

典型场景:**内容型网站(博客、文档、电商详情页)必须 SSR**,因为 SEO 和首屏是命根子。

### 手写一个最简 SSR

思路很简单:服务端把数据塞进模板,渲染成 HTML 字符串,返回给浏览器。


#### 装一下环境

```bash
npm install express
```

#### 代码

```js
// server.js
const express = require('express');
const app = express();

// 模拟从数据库取文章
const posts = [
  { id: 1, title: 'Node 与开发', views: 1024 },
  { id: 2, title: 'Node 基础', views: 2048 },
];

// 模板函数:把数据渲染成 HTML(生产中用模板引擎或组件渲染)
function renderPost(post) {
  return `
<!DOCTYPE html>
<html>
<head><title>${post.title}</title></head>
<body>
  <h1>${post.title}</h1>
  <p>阅读量:${post.views}</p>
</body>
</html>`;
}

app.get('/post/:id', (req, res) => {
  const post = posts.find((p) => p.id === Number(req.params.id));
  if (!post) return res.status(404).send('Not Found');
  res.send(renderPost(post)); // 返回完整 HTML
});

app.listen(3000, () => console.log('SSR on http://localhost:3000'));
```

浏览器打开 `http://localhost:3000/post/1`,**右键查看源代码**,能看到完整的 `<h1>Node 与开发</h1>`——这就是 SSR 和 CSR 最直观的区别。

### 从手写 SSR 到 Next.js / Nuxt

上面手写版返回的是**死 HTML**:能看、能被爬虫抓,但按钮点了没反应,跳转会整页刷新。服务端只吐了字符串,浏览器里没有 React / Vue 去绑事件。

Next.js / Nuxt 做的是另一件事:**首屏仍走 SSR,JS 下载完后再"水合(hydration)"接管**。

水合就是:浏览器先立刻画出服务端 HTML(首屏快、SEO 不丢),再把事件和状态挂到**已经存在的 DOM** 上,页面从"能看"变成"能点"。这就是开头表格里那句「需要水合再接管」。

```mermaid
flowchart LR
  req[请求页面] --> ssr[服务端渲染HTML]
  ssr --> show[浏览器立刻能看]
  show --> js[下载JS]
  js --> hydrate[水合接管]
  hydrate --> spa[可点击可跳转]
```

| | 纯 SSR(手写模板) | Next.js / Nuxt |
| --- | --- | --- |
| HTML | 服务端生成 | 服务端生成 |
| 交互 | 没有,或自己写原生 JS | 水合后变成可交互页面 |
| 跳转 | 每次整页刷新 | 水合后走客户端路由,不再整页刷 |
| 组件 | 字符串拼接 | 组件化,可复用 |
| 数据 | 自己塞进模板 | 框架在服务端取好再注入 |

生产里几乎不会手写模板,而是用框架:

- **Next.js**(React):Pages Router 用 `getServerSideProps`,每次请求都在服务端取数再渲染;App Router 用 Server Components,数据默认在服务端取,客户端只收到必要的 JS
- **Nuxt**(Vue):`useAsyncData` / `useFetch`,服务端执行一次,水合时把结果复用给客户端,**不会再打一遍接口**

```jsx
// Next.js Pages Router:数据在服务端取好,组件直接渲染
export default function Post({ post }) {
  return <h1>{post.title}</h1>;
}

export async function getServerSideProps({ params }) {
  const post = await db.getPost(params.id);
  return { props: { post } }; // 服务端渲染时注入
}
```

```vue
<!-- Nuxt:useFetch 在服务端跑,水合时直接复用,客户端不重复请求 -->
<script setup>
const route = useRoute()
const { data: post } = await useFetch(`/api/posts/${route.params.id}`)
</script>

<template>
  <h1>{{ post.title }}</h1>
</template>
```

理解手写版再上框架,你就明白框架帮你解决了什么:模板引擎、水合、路由、数据注入、缓存。

## 二、Mock:接口模拟

### Mock 是什么

Mock 是**在后端接口没写好(或没部署)时,用 Node 起一个假接口服务**,返回模拟数据。前端开发、联调、测试全靠它。

典型场景:

- 后端排期晚于前端,前端要**先行开发**
- 接口字段还没定稿,先用 Mock 定结构
- 自动化测试不想依赖真实服务

### 手写一个最简 Mock 服务

```js
// mock-server.js
const express = require('express');
const app = express();

// 内存数据源:模拟数据库
const db = {
  users: [
    { id: 1, name: 'acye', avatar: 'https://example.com/a.png' },
    { id: 2, name: 'nobody', avatar: 'https://example.com/b.png' },
  ],
  articles: [
    { id: 1, title: 'SSR 与 Mock', authorId: 1, content: '...' },
  ],
};

// 接口路径、返回结构尽量与真实后端保持一致
app.get('/api/users/:id', (req, res) => {
  const user = db.users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ code: 404, message: 'user not found' });
  res.json({ code: 0, data: user });
});

app.get('/api/articles', (req, res) => {
  const list = db.articles.map((a) => ({ ...a, author: db.users.find((u) => u.id === a.authorId) }));
  res.json({ code: 0, data: list });
});

// 模拟网络延迟,更贴近真实
app.use((req, res, next) => setTimeout(next, 200));

app.listen(3001, () => console.log('Mock on http://localhost:3001'));
```

前端联调时,把接口地址指到 `http://localhost:3001`,等真实后端就绪后**只改一行 baseURL**:

```js
// api.js
const BASE = import.meta.env.DEV ? 'http://localhost:3001' : '/api';
export const getUser = (id) => fetch(`${BASE}/users/${id}`).then((r) => r.json());
```

### Mock 的进阶玩法

| 方案 | 适用场景 |
| --- | --- |
| 手写 Express 返回假数据 | 简单项目、学习(上面这个) |
| JSON Server(一个 JSON 文件生成 REST API) | 原型验证、快速出假数据 |
| MSW(Mock Service Worker) | 前端测试里拦截真实请求 |
| 中间件式 Mock(按环境开关) | 大项目,随构建环境切换 |

大项目常用"中间件式":同一个服务,`NODE_ENV=development` 时走 Mock 数据,生产环境直接转发真实后端:

```js
app.use('/api', (req, res) => {
  if (process.env.USE_MOCK === 'true') {
    return mockHandler(req, res); // 返回假数据
  }
  // 否则代理到真实后端
  proxy(req, res, { target: 'http://api.internal' });
});
```

## 总结

- **SSR**:服务端生成 HTML,解决 SEO 和首屏。手写版 = 数据 + 模板 → 完整 HTML;生产用 Next.js / Nuxt
- **Mock**:用 Node 起假接口,让前端先行开发。核心是**接口结构对齐真实后端 + 环境可切换**
- 两者都是"一个 Node 服务",是 BFF 之外,前端最常用的两个自建服务场景
