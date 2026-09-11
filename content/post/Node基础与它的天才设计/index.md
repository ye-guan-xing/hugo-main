---
draft: false
date: 2026-09-11 09:20:00 +08:00
slug: "node-basics-and-design"
title: "Node 基础与它的天才设计"
categories: ["Node.js"]
tags: ["Node.js", "模块系统", "事件循环", "异步"]
---

这篇把地基打牢:模块系统、内置模块、包管理、异步模型和调试。这五块是 Node 最核心的知识,也是面试和工程里最常考的东西。

其中**异步与事件循环**是 Node 设计的灵魂,值得花最多时间。

## 模块系统:CommonJS 与 ESM

浏览器里的 JS 靠 `<script>` 标签引入,全局变量满天飞。Node 引入了**模块系统**,每个文件是一个独立作用域,通过 `require`/`import` 显式导入导出。

Node 历史上有两套模块规范:

| | CommonJS(CJS) | ES Module(ESM) |
| --- | --- | --- |
| 关键词 | `require` / `module.exports` | `import` / `export` |
| 文件后缀 | `.js`(默认) | `.mjs`,或在 `package.json` 设 `"type": "module"` |
| 加载时机 | **运行时**同步加载 | **编译时**静态分析,支持 tree-shaking |
| 顶层 this | 模块对象 | `undefined` |
| 主流生态 | npm 老包、Node 服务端 | 现代框架(Vite、Next.js)默认 |

```js
// CommonJS:utils.js
module.exports = { add: (a, b) => a + b };

// CommonJS:main.js
const { add } = require('./utils');

// ESM:utils.mjs
export const add = (a, b) => a + b;

// ESM:main.mjs
import { add } from './utils.mjs';
```

**前端开发者要特别注意**:现在的前端工程(Vite、Next.js)默认是 ESM,但很多 Node 工具脚本还是 CJS。看到 `require is not defined` 或 `Cannot use import statement outside a module`,基本都是两套规范混用导致的。

## 内置模块:fs、path、http、events

Node 自带一批核心模块,不装任何依赖就能用。前端最常用的四个:

### fs(文件系统)

```js
const fs = require('fs');

// 同步(会阻塞,脚本里可用)
const data = fs.readFileSync('./a.txt', 'utf-8');

// 异步(推荐,不阻塞)
fs.readFile('./a.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

### path(路径处理)

跨平台路径拼接的救星——**永远不要自己拼字符串**:

```js
const path = require('path');

path.join('/a', 'b', 'c.txt'); // /a/b/c.txt
path.resolve('dist');          // 基于当前目录解析出绝对路径
path.basename('/a/b/c.txt');   // c.txt
```

### http(网络服务)

用原生模块就能起一个服务器:

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello Node');
});

server.listen(3000);
```

### events(事件机制)

Node 的核心设计之一:**很多能力都基于"事件"**。`EventEmitter` 是发布订阅模式的实现:

```js
const { EventEmitter } = require('events');

const emitter = new EventEmitter();
emitter.on('data', (msg) => console.log('收到:', msg));
emitter.emit('data', 'hello');
```

理解了 events,你就能理解 Node 里大量的"监听"写法(`stream.on('data')`、`process.on('exit')`)。

## npm / pnpm / yarn + package.json

### package.json 是项目的"说明书"

```json
{
  "name": "my-app",
  "scripts": {
    "dev": "vite",
    "build": "node scripts/build.js",
    "test": "vitest"
  },
  "dependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

- `dependencies`:运行时依赖
- `devDependencies`:构建/开发期依赖
- `scripts`:命令入口,`npm run dev` 等价于执行 `vite`

### 为什么前端圈越来越推荐 pnpm

| 能力 | npm | pnpm |
| --- | --- | --- |
| 安装速度 | 慢(重复下载) | 快(全局内容寻址存储,硬链接) |
| 磁盘占用 | 大(node_modules 臃肿) | 小(同版本只存一份) |
| 幽灵依赖 | 有(扁平化导致) | 无(严格隔离) |
| 锁文件 | package-lock.json | pnpm-lock.yaml |

pnpm 通过**硬链接 + 内容寻址存储**,把依赖放到全局仓库,项目里只放链接。这也是"从 10 分钟到 10 秒"那篇文章的核心结论。

## 异步与事件循环:Node 的天才设计

### 为什么是异步的?

Node 面向 I/O 密集型场景(网络请求、读写文件)。如果用同步,一个慢请求会卡死整个进程。异步 + 事件循环让 Node **单线程也能同时处理大量并发**——遇到 I/O 就"挂起"任务,去干别的,等结果回来再继续。

### 回调 → Promise → async/await 的演进

```js
// 1. 回调地狱
getUser(id, (user) => {
  getOrders(user.id, (orders) => {
    getCoupons(orders[0].id, (coupons) => {
      console.log(coupons);
    });
  });
});

// 2. Promise 链
getUser(id)
  .then((user) => getOrders(user.id))
  .then((orders) => getCoupons(orders[0].id))
  .then((coupons) => console.log(coupons));

// 3. async/await —— 用同步的写法写异步
async function main() {
  const user = await getUser(id);
  const orders = await getOrders(user.id);
  const coupons = await getCoupons(orders[0].id);
  console.log(coupons);
}
```

### 事件循环与微任务/宏任务

这是面试必考题,也是理解 Node 的关键。事件循环是**一个循环扫描任务队列的机制**,任务分两类:

- **宏任务(macrotask)**:`setTimeout`、`setInterval`、I/O 回调 —— 每个阶段一批
- **微任务(microtask)**:`Promise.then`、`queueMicrotask`、`process.nextTick` —— **宏任务结束后立即全部清空**

执行顺序的核心口诀:

```
同步代码 → 本轮微任务(全部)→ 下一个宏任务 → 它的微任务 → …
```

```js
console.log('1');                    // 同步

setTimeout(() => console.log('2'));  // 宏任务

Promise.resolve().then(() => {
  console.log('3');                  // 微任务
});

// 输出顺序:1 → 3 → 2
```

`process.nextTick` 比 Promise 还快,优先级最高,不过日常开发用得少。

## 调试:node --inspect / debugger

前端同学调试浏览器用 DevTools,调试 Node 同样可以用 DevTools——**Node 原生支持**。

```bash
# 方式一:启动时开启调试
node --inspect app.js
# 或:第一行就断点等待
node --inspect-brk app.js
```

启动后浏览器访问 `chrome://inspect`,就能看到 Node 的调试目标,打开后就是熟悉的 DevTools 界面:断点、单步、变量监视、调用栈,全都支持。

代码里还可以直接用 `debugger` 语句打断点:

```js
function calc(a, b) {
  debugger; // 执行到这里自动暂停
  return a + b;
}
```

另外 `node --watch`(Node 18+)可以在文件变化时自动重启,开发体验接近前端的 HMR。

## 总结

- **模块系统**:CJS 和 ESM 两套规范,知道什么时候用哪个
- **内置模块**:fs、path、http、events,零依赖解决 80% 的脚本需求
- **包管理**:pnpm 是当前前端生态的最优解,懂 package.json 才能管好项目
- **异步与事件循环**:回调 → Promise → async/await 的演进,微任务/宏任务的执行顺序
- **调试**:node --inspect 直接复用浏览器 DevTools
