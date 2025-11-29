---
draft: false
date: 2025-11-29 22:36:00 +0800
title: "跨域问题讲解"
categories: ["web开发"]
tags: ["项目开发", "全栈开发", "跨域", "Nginx"]
---

## 前言

在前后端分离开发模式下，**跨域**是前端开发者绕不开的问题。浏览器的同源策略限制了不同域名/端口间的资源请求，而解决跨域的核心方案主要有两种：**CORS（跨域资源共享）** 和**反向代理**。本文结合全域生活平台的示例，详解这两种方案的原理、应用场景及踩坑要点。

- 注：后文会详细讲解 Nginx 反向代理（这是前端程序员的必备知识）

## 一、问题背景：为什么会跨域？

先看我们的项目环境：

- 前端（Vue）运行在 `http://localhost:8081`（通过`vue.config.js`配置）；
- 后端（Express）运行在 `http://localhost:8080`（接口路径如`/api/merchant`）。

浏览器的同源策略要求“协议+域名+端口”完全一致，因此前端直接请求后端接口会触发跨域错误——比如控制台提示`No 'Access-Control-Allow-Origin' header is present on the requested resource`。

## 二、CORS：后端主导的跨域解决方案

CORS 是 W3C 标准，通过后端设置响应头允许指定源的跨域请求，是最直接的跨域方案之一。以下是两种常见的 CORS 配置方式：

### 1. 方案 1：使用`cors`中间件（便捷高效）

Express 生态提供了`cors`包，可一键配置跨域规则，也是项目中最常用的方式：

```javascript
// 使用cors中间件的Express代码
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
// 全局启用cors，默认允许所有源（生产环境建议指定具体源）
app.use(
  cors({
    origin: "http://localhost:8081", // 仅允许前端8081端口访问
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 允许的请求方法
    allowedHeaders: ["Content-Type", "Authorization"], // 允许的请求头
  })
);

// 接口路由
const merchantRouder = require("./routes/merchant");
const customerRouder = require("./routes/service");
const orderRouder = require("./routes/order");
app.use("/api/merchant", merchantRouder);
app.use("/api/service", customerRouder);
app.use("/api/order", orderRouder);

app.listen(8080, () => {
  console.log("服务器启动成功！");
  console.log("http://localhost:8080");
});
```

这种方式无需手动处理预检请求，`cors`包会自动拦截`OPTIONS`请求并返回正确响应头。

### 2. 方案 2：手动配置 CORS（深入原理）

若不想依赖第三方包，可手动设置响应头并处理预检请求（适合理解 CORS 底层逻辑）：

```javascript
// 手动处理CORS的Express代码
const express = require("express");
const app = express();

app.use(express.json());

// 自定义跨域中间件
app.use((req, res, next) => {
  // 允许前端8081端口访问
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
  // 允许的请求方法（覆盖所有常用HTTP方法）
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  // 允许的请求头（支持JSON、Token等）
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 处理OPTIONS预检请求（非简单请求必加）
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // 预检请求直接返回200，不进入业务路由
  }

  next(); // 非预检请求，继续执行后续中间件/路由
});

// 接口路由不变
app.use("/api/merchant", require("./routes/merchant"));
app.use("/api/service", require("./routes/service"));
app.use("/api/order", require("./routes/order"));

app.listen(8080, () => {
  console.log("服务器启动成功！http://localhost:8080");
});
```

### 3. CORS 的关键细节

- **预检请求（OPTIONS）**：前端发送`PUT/DELETE`或带自定义头的请求时，浏览器会先发`OPTIONS`请求“探路”，后端必须正确响应才能触发真实请求；
- **Access-Control-Allow-Origin**：生产环境需指定具体域名（如`https://your-domain.com`），而非通配符`*`（否则前端无法携带 Cookie/Token）；
- **简单请求豁免预检**：`GET/POST/HEAD`请求且请求头仅含`Accept`/`Content-Type`等基础字段时，无需预检。

## 三、devServer 反向代理：前端开发环境的跨域捷径

虽然 CORS 能解决跨域，但开发阶段频繁修改后端配置效率低。Vue CLI 的`devServer.proxy`通过反向代理绕过浏览器跨域限制，是更优雅的开发方案。

### 1. 反向代理的工作原理

`devServer.proxy`让前端开发服务器充当“中间人”：

1. 前端请求**同源的开发服务器**（如`http://localhost:8081/api/merchant`）；
2. 开发服务器将请求转发给后端（`http://localhost:8080/api/merchant`）；
3. 后端响应结果由开发服务器回传给前端。

整个过程中浏览器仅与同源的`localhost:8081`交互，自然不会触发跨域限制。

### 2. 前端配置源码解析（vue.config.js）

```javascript
// web-admin/vue.config.js
module.exports = {
  devServer: {
    port: 8081, // 前端开发端口（避开后端8080端口冲突）
    open: true, // 启动后自动打开浏览器
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 后端接口真实地址
        changeOrigin: true, // 模拟后端服务器的Origin（关键！避免后端跨域拦截）
        // pathRewrite: { "^/api": "" }, // 后端接口无/api前缀时启用（如后端是/merchant）
      },
    },
  },
};
```

### 3. 关键配置说明

- **target**：后端接口的根地址；
- **changeOrigin: true**：让后端误以为请求来自`localhost:8080`（同源），避免后端的跨域拦截逻辑；
- **pathRewrite**：示例中注释掉是因为后端接口带`/api`前缀（如`/api/merchant`），若后端接口无`/api`，需通过此配置去掉前缀。

### 4. 踩坑实录：为什么去掉 CORS 仍报错？

很多开发者疑惑：“明明配了`devServer.proxy`，为什么后端去掉 CORS 还是报跨域错？”  
核心原因是**非简单请求的`OPTIONS`预检请求会被代理转发到后端，而后端未处理预检**——哪怕前端用了代理，浏览器收到后端非法的预检响应后，仍会判定跨域失败。

#### （1）预检请求的“转发陷阱”

前端`devServer.proxy`会转发**所有请求**（包括`OPTIONS`预检请求）到后端。比如前端发送`POST /api/merchant`（带 JSON 数据，属于非简单请求）：

1. 浏览器先发送`OPTIONS /api/merchant`到前端开发服务器（`localhost:8081`）；
2. 开发服务器把这个`OPTIONS`请求转发到后端（`localhost:8080/api/merchant`）；
3. 若后端没配置 CORS、也没手动处理`OPTIONS`，会返回**无跨域响应头的默认响应**（甚至 404）；
4. 浏览器收到这个非法响应，直接抛出跨域错误，真实的`POST`请求根本不会发送。

你的后端代码（去掉`cors`且无预检处理）：

```javascript
// 后端未处理OPTIONS预检请求
app.use(express.json());
// 无CORS配置，也无OPTIONS处理逻辑
app.use("/api/merchant", merchantRouder);
```

此时后端对`OPTIONS`请求的响应里没有`Access-Control-Allow-Origin`等头，浏览器自然判定跨域失败。

#### （2）开发环境最优解：保留代理+后端极简预检处理

所谓“后端无需配置 CORS”，并非完全不用处理跨域，而是**不用依赖`cors`包，但需手动处理预检请求**（仅需几行代码）：

```javascript
const express = require("express");
const app = express();

app.use(express.json());

// 极简预检处理（开发环境够用）
app.use((req, res, next) => {
  // 允许前端源（开发环境可直接用*，生产环境需指定域名）
  res.setHeader("Access-Control-Allow-Origin", "*");
  // 允许的请求方法和头（覆盖非简单请求需求）
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 拦截OPTIONS预检请求，直接返回200
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/api/merchant", merchantRouder);
// ...其他路由

app.listen(8080);
```

这样后端能合法响应预检请求，前端代理就能正常工作——既不用装`cors`包，也能避免跨域错误。

#### （3）简单请求的“例外情况”

如果前端只发**简单请求**（比如`GET /api/merchant`，无自定义头、无复杂数据），即使后端没处理预检，也可能成功：

- 简单请求不会触发`OPTIONS`预检，前端代理直接转发`GET`请求到后端；
- 后端返回数据给前端服务器，前端服务器再返回给浏览器（浏览器只看前端服务器的同源响应，不会校验后端的跨域头）。

但只要涉及`POST`（JSON 数据）、`PUT/DELETE`等非简单请求，必须处理预检，否则必报错。

## 四、Nginx 反向代理：生产环境的终极方案

`devServer.proxy`仅适用于开发环境，生产环境需用 Nginx 反向代理——既能解决跨域，又能优化资源加载和接口转发，是前端部署的标配。

### 1. Nginx 反向代理的优势

- 统一域名：将前端静态资源和后端接口代理到同一域名下（如`https://your-domain.com`）；
- 性能优化：支持缓存、压缩、负载均衡；
- 安全防护：隐藏后端真实地址，降低攻击风险。

### 2. Nginx 配置示例

```nginx
# nginx.conf 或 conf.d/your-project.conf
server {
    listen 80; # 监听80端口（HTTP）
    server_name your-domain.com; # 生产环境域名

    # 前端静态资源配置（Vue打包后的dist目录）
    location / {
        root /usr/share/nginx/html/your-project; # 前端dist目录路径
        index index.html index.htm; # 默认首页
        try_files $uri $uri/ /index.html; # 解决Vue History路由刷新404问题
    }

    # 后端接口反向代理
    location /api {
        proxy_pass http://localhost:8080; # 转发到后端服务地址
        proxy_set_header Host $host; # 传递请求主机名
        proxy_set_header X-Real-IP $remote_addr; # 传递客户端真实IP
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; # 传递代理链IP
    }
}
```

### 3. HTTPS 配置（生产环境必加）

若需支持 HTTPS，只需添加 SSL 证书配置：

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    # SSL证书路径
    ssl_certificate /etc/nginx/ssl/your-domain.crt;
    ssl_certificate_key /etc/nginx/ssl/your-domain.key;

    # 前端静态资源+接口代理配置同上...
}
```

## 五、总结

- **开发环境**：优先使用`devServer.proxy`反向代理，无需频繁修改后端配置；
- **生产环境**：推荐 Nginx 反向代理（统一域名+性能优化），或后端配置 CORS（不常用，这算黑魔法）；
- **CORS 核心**：处理预检请求+设置正确的响应头；
- **反向代理核心**：让前端请求同源地址，由代理服务器转发到后端。

结合源码理解这两种方案，跨域问题就能迎刃而解！
