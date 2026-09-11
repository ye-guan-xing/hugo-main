---
draft: false
date: 2026-09-11 09:40:00 +08:00
slug: "bff-simple-implementation"
title: "BFF 的简单实现:用 Node 给前端做一个中间层"
categories: ["Node.js", "工程化"]
tags: ["Node.js", "工程化", "BFF", "Express", "全栈"]
---

BFF(Backend For Frontend)是前端进阶最值得先做的实践:**用一个 Node 服务,专门为前端页面拼数据**。

## BFF 是什么

BFF 全称 **Backend For Frontend**(为前端而生的后端),最早由 SoundCloud 提出。它不是一个框架,而是一种**架构模式**:在前端和后端之间,加一个只服务前端的中间层。

为什么需要它?因为后端接口是为"所有客户端"设计的,而你的页面有特殊需求:

| 痛点 | 后端视角 | BFF 解决方式 |
| --- | --- | --- |
| 接口太碎 | 用户、订单、优惠券是三个接口 | 聚合成一个页面接口 |
| 数据冗余 | 返回 20 个字段,页面只用 5 个 | 裁剪字段,只给前端要的 |
| 协议不适配 | 返回 XML / 分页结构复杂 | 转成前端友好的 JSON |
| 敏感字段 | 接口直接暴露内部字段 | BFF 层过滤脱敏 |
| 跨域麻烦 | 前端直连多个域 | 统一从 BFF 同域转发 |

简单说:**BFF 是前端的"专属外卖",后端是大食堂,你不想自己跑三个窗口打菜。**

## 环境准备

用 Express 搭一个最简 BFF:

```bash
mkdir bff-demo && cd bff-demo
npm init -y
npm install express
```

## 场景:页面需要聚合三个接口

假设后端已有三个内部接口(或者用 JSON 模拟):

- `GET /internal/user` → 用户信息
- `GET /internal/orders` → 订单列表
- `GET /internal/coupons` → 优惠券

前端页面一次要全部数据。直接让前端调三个接口再拼,会带来:请求慢(串行)、逻辑散落前端、接口地址暴露内部域名。

## BFF 实现:聚合 + 裁剪

```js
// server.js
const express = require('express');
const app = express();

// 模拟后端内部接口(真实场景用 fetch 调内部服务)
const mockApi = (data, delay = 100) =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

async function getUser(id) {
  return mockApi({ id, name: 'acye', phone: '138****0000', email: 'a@b.com', _internal: 'secret' });
}
async function getOrders(id) {
  return mockApi([{ id: 1, title: '订单A', price: 99 }, { id: 2, title: '订单B', price: 199 }]);
}
async function getCoupons() {
  return mockApi([{ id: 'c1', amount: 20 }]);
}

// 页面聚合接口:BFF 的核心
app.get('/api/page/home', async (req, res) => {
  const userId = req.query.userId || 1;

  // 并行请求,三个接口同时发,总耗时 = 最慢的那个
  const [user, orders, coupons] = await Promise.all([
    getUser(userId),
    getOrders(userId),
    getCoupons(),
  ]);

  // 裁剪字段:只给前端要的,内部字段不外泄
  res.json({
    user: { id: user.id, name: user.name, phone: user.phone },
    orders: orders.map((o) => ({ id: o.id, title: o.title, price: o.price })),
    coupons,
  });
});

app.listen(3000, () => console.log('BFF listening on http://localhost:3000'));
```

启动后,前端只需要:

```js
const data = await fetch('/api/page/home?userId=1').then((r) => r.json());
```

一个请求拿到全部数据,而且页面代码里**完全不知道内部接口的存在**。

## 进阶:超时、错误兜底与缓存

真实场景里,内部接口可能很慢甚至挂掉,需要加保护:

```js
const withTimeout = (p, ms = 3000) =>
  Promise.race([
    p,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);

app.get('/api/page/home', async (req, res) => {
  const userId = req.query.userId || 1;

  try {
    const [user, orders, coupons] = await Promise.all([
      withTimeout(getUser(userId)),
      withTimeout(getOrders(userId)),
      // 优惠券挂了不影响主流程
      getCoupons().catch(() => []),
    ]);

    res.json({ user, orders, coupons });
  } catch (err) {
    // 聚合失败时给一个兜底,而不是让前端白屏
    res.status(502).json({ error: 'upstream error', detail: err.message });
  }
});
```

要点:

- `Promise.all` 并行请求,避免串行累加耗时
- `Promise.race` 做超时控制,防止内部接口拖死页面
- 非关键数据用 `.catch(() => [])` 降级,保证主流程可用
- 统一错误出口,前端只需处理一种错误结构

## 什么时候不需要 BFF

BFF 不是万能药。加一层就多一个要部署、要看日志、挂了页面全挂的服务。痛点不在,就别加。

- **后端已经给了页面级接口**:比如已经有 `/api/page/home`,用户、订单、优惠券后端自己拼好了。你再套一层 BFF,只是把请求原样转发一遍,纯属重复。
- **纯展示型小项目,一个接口就够**:个人博客、落地页,就一个列表接口。前端直连后端,没有"拼三个接口"的成本,加 BFF 是给自己找运维。
- **团队没有 Node 运维能力**:BFF 挂了,页面接口全挂。还不会部署、看日志、设告警时,先别进生产。可以从 Mock 练手(只在本地跑,不扛流量)。

判断标准就一条:**前端是不是在为"拼数据"付出明显成本(慢、乱、重复)?** 是,才值得加 BFF。

## 总结

- BFF 是在前端和后端之间加一层"前端专属服务",解决聚合、裁剪、脱敏、跨域
- 核心实现 = Express + `Promise.all` 并行聚合 + 字段裁剪
- 生产级 BFF 还要有超时、降级、缓存、监控
- 用 Node 做 BFF,是前端低成本获得"写服务端代码"能力的最佳入口
