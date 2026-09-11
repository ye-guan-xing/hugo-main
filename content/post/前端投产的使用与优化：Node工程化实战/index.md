---
draft: false
date: 2026-09-11 10:20:00 +08:00
slug: "frontend-production-practices"
title: "前端投产的使用与优化:Node 工程化实战"
categories: ["工程化", "Node.js"]
tags: ["Node.js", "工程化", "Vite", "测试", "部署"]
---

这篇回到前端的主场:**怎么用 Node 把前端项目从"能跑"推向"能上线、好维护"**。覆盖构建、CLI、测试、部署、日志监控五块。

## 构建工具:Webpack / Vite / esbuild

前端产物最终都要经过构建,而**构建器本身就是一个 Node 进程**。理解它,你才能解决构建报错、优化打包体积。

### 三者的定位

| | Webpack | Vite | esbuild |
| --- | --- | --- | --- |
| 定位 | 老牌全能构建器 | 新一代开发服务器 + 打包 | 极速打包器(底层) |
| 开发速度 | 慢(全量打包) | 快(按需编译 + 缓存) | 最快(Go 写的) |
| 配置复杂度 | 高 | 低(约定优于配置) | 极低 |
| 适用 | 存量大型项目 | 新项目首选 | Vite 内部依赖它 |

Vite 开发时用 esbuild 转译、按需加载,生产用 Rollup 打包——这是它"快"的秘诀。

### 用 Node 调试构建脚本

构建问题最常见的排查方式,是直接写一个 Node 脚本观察中间产物:

```js
// scripts/inspect-build.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. 先构建
execSync('vite build', { stdio: 'inherit' });

// 2. 分析产物体积
const dist = path.resolve(__dirname, '../dist');
function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    const size = fs.statSync(full).size / 1024;
    if (size > 100) console.log(`${(size / 1024).toFixed(2)} MB  ${full}`);
  });
}
walk(dist);
```

配合 `vite build --report`(生成依赖体积报告)或 `rollup-plugin-visualizer`,就能定位"哪个包拖大了首屏"。

### 构建优化三板斧

1. **按需引入**:`import { Button } from 'element-plus'` 配合 `unplugin-vue-components`,别整包引入
2. **代码分割**:路由级 `import()` 动态导入,Vite 自动分包
3. **压缩与 tree-shaking**:ESM 让未用代码在构建时被删掉,`esbuild` 压缩

## 写 CLI 工具:commander

前端团队内部工具(脚手架、发布脚本、代码生成器)几乎都是 Node CLI。`commander` 是事实标准:

```bash
npm install commander
```

```js
#!/usr/bin/env node
// bin/gen-component.js
const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .name('gen')
  .description('生成一个 Vue 组件')
  .argument('<name>', '组件名')
  .option('-d, --dir <dir>', '目标目录', 'src/components')
  .action((name, options) => {
    const target = path.resolve(options.dir, `${name}.vue`);
    const template = `<template>\n  <div class="${name.toLowerCase()}"></div>\n</template>\n\n<script setup>\n</script>\n`;
    fs.writeFileSync(target, template);
    console.log(`✅ 已生成 ${target}`);
  });

program.parse();
```

然后在 `package.json` 注册:

```json
{
  "bin": { "gen": "./bin/gen-component.js" },
  "scripts": { "gen": "node bin/gen-component.js" }
}
```

跑 `npm run gen -- MyButton` 就能生成组件文件。CLI 的价值在于:**把重复的手工操作固化成一条命令**,团队所有人都受益。

## 测试:Jest / Vitest / supertest

前端测试分两层:组件/单元测试用 **Vitest**(Vite 生态,快),接口测试用 **supertest**。

### 单元测试(Vitest)

```bash
npm install -D vitest
```

```js
// utils/math.js
export const add = (a, b) => a + b;
```

```js
// utils/math.test.js
import { describe, it, expect } from 'vitest';
import { add } from './math';

describe('add', () => {
  it('两个数字相加', () => {
    expect(add(1, 2)).toBe(3);
  });
  it('边界:负数', () => {
    expect(add(-1, 1)).toBe(0);
  });
});
```

```json
// package.json
{ "scripts": { "test": "vitest run" } }
```

### 接口测试(supertest + Express)

连服务都不用真的起,`supertest` 直接打你的 app:

```js
const request = require('supertest');
const app = require('./app'); // 导出的 Express app

it('GET /api/users/:id 返回用户', async () => {
  const res = await request(app).get('/api/users/1');
  expect(res.status).toBe(200);
  expect(res.body.data.name).toBe('acye');
});
```

**关键习惯**:把 `app` 和 `server.listen` 拆开,测试才能直接注入 `app`。这也是可测试性的一个体现。

## 部署:PM2 / Docker / Nginx

### 静态前端产物

前端构建产物是纯静态文件,部署 = 把 `dist/` 放到 Nginx 下:

```nginx
server {
  listen 80;
  root /var/www/my-app/dist;   # 前端产物

  location /api/ {
    proxy_pass http://127.0.0.1:3000;  # 反向代理到 Node 服务
  }

  # SPA 路由回退
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Node 服务(接口/BFF/SSR)

#### 用 PM2 守护进程

```bash
npm install -g pm2

pm2 start server.js --name my-api --env production
pm2 save            # 保存进程列表
pm2 restart my-api  # 更新后重启
pm2 logs my-api     # 查看日志
```

PM2 解决:**进程挂了自动重启、开机自启、日志收集、多实例负载**。

#### 用 Docker 打包

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t my-api .
docker run -d -p 3000:3000 --restart always my-api
```

**推荐组合**:Docker 保证环境一致 → PM2(或 K8s)管理进程 → Nginx 做入口和反向代理。

## 日志与监控:winston / pm2

这块不是给浏览器页面用的。静态前端(Nginx 托管 `dist`)出问题,看的是 Nginx 日志、浏览器 Network、Sentry。**winston / pm2 给的是前端自己跑的 Node 进程**:BFF、SSR、自建接口。这些服务上线后出现 502、超时、聚合失败,只能看服务端日志才能定位。

直接用 `console.log` 的问题:没有级别、没有结构化、生产/开发分不开。

### 用 winston 结构化日志

```js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // 结构化输出,方便收集
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// 请求日志中间件
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      cost: `${Date.now() - start}ms`,
    });
  });
  next();
});
```

**监控的核心指标**:请求量、错误率、P95 延迟。有结构化日志后,可以用 PM2 + `pm2-logrotate` 切割日志,或接入 ELK / Loki 做可视化检索。

## 总结

- **构建**:Vite 是新项目首选,理解构建器是 Node 进程,才能自己排查和优化
- **CLI**:commander 把团队重复操作固化成命令
- **测试**:Vitest 管单元/组件,supertest 管接口,app 与 listen 分离是关键
- **部署**:静态产物走 Nginx,Node 服务用 Docker + PM2,统一由 Nginx 反代
- **日志**:winston 给 BFF/SSR 这类 Node 服务用,请求耗时、状态码、错误级别是监控三要素

到这里,Node 从"是什么"到"能投产"的路径就完整了。后续可以深入的方向:WebSocket 实时应用、TypeScript × Node 工程化、性能分析与压测优化——按需选学即可。
