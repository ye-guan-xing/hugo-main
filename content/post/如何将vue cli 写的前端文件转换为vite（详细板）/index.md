---
draft: false
date: 2025-12-14 22:36:00 +0800
title: "如何将vue cli 写的前端文件转换为vite（详细板）"
categories: ["web开发", "开发问题精讲"]
tags: ["项目开发"]
---

# 从 Vue CLI 迁移到 Vite 的完整指南

## 📋 迁移概览

将项目从 Vue CLI 迁移到 Vite 确实如你所说，主要包括以下几个核心步骤。

## 🗺️ 迁移路线图

### **步骤 1：备份原有项目**

```bash
# 在开始前一定要备份
cp -r my-project my-project-backup
```

### **步骤 2：删除旧配置文件**

```bash
# 删除 Vue CLI 相关配置文件
rm vue.config.js
rm babel.config.js  # 如果存在
rm .eslintrc.js     # 如果使用单独的配置文件
```

### **步骤 3：清理项目依赖**

```bash
# 删除 node_modules 和锁文件
rm -rf node_modules
rm package-lock.json  # 或 rm yarn.lock
```

## 📝 详细步骤说明

### **1. 修改 package.json**

**主要变化：**

```json
{
  "type": "module", // 新增：声明为 ES 模块
  "scripts": {
    // Vue CLI 脚本 → Vite 脚本
    "serve": "vue-cli-service serve", // 删除
    "build": "vue-cli-service build", // 删除
    "dev": "vite", // 新增
    "build": "vite build", // 修改
    "preview": "vite preview" // 新增
  },
  "dependencies": {
    // 移除 Vue CLI 特定的依赖
    // 保持应用层依赖不变
  },
  "devDependencies": {
    // 完全替换开发依赖
    "@vue/cli-*": "~5.0.0", // 删除所有
    "@vitejs/plugin-vue": "^5.0.5", // 新增
    "vite": "^5.4.8", // 新增
    "sass-embedded": "^1.83.0" // 推荐使用 sass-embedded
  }
}
```

**为什么要这样改？**

- Vue CLI 基于 Webpack，而 Vite 是全新的构建工具
- `type: "module"` 让 Node.js 支持 ES6 模块语法
- Vite 的命令更简洁直观

### **2. 配置文件迁移**

**从 `vue.config.js` 到 `vite.config.js`**

```javascript
// vue.config.js (旧)
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://10.245.30.86:8080",
        changeOrigin: true,
      },
    },
  },
};

// vite.config.js (新)
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://10.245.30.86:8080",
        changeOrigin: true,
      },
    },
  },
});
```

**关键差异：**

- Vite 使用 ES 模块语法 (`import/export`)
- 配置结构更扁平
- 热更新速度显著提升

### **3. 环境变量处理**

**Vue CLI 方式：**

```javascript
// .env.development
VUE_APP_BASE_API=/api
VUE_APP_PROXY_TARGET=http://10.245.30.86:8080

// 代码中使用
process.env.VUE_APP_BASE_API
```

**Vite 方式：**

```javascript
// .env.development
VITE_BASE_API=/api
VITE_PROXY_TARGET=http://10.245.30.86:8080

// 代码中使用
import.meta.env.VITE_BASE_API
```

**或者保留 Vue 前缀：**

```javascript
// vite.config.js 中配置
envPrefix: ["VUE_APP_", "VITE_"],
  // 这样可以使用两种前缀
  import.meta.env.VUE_APP_BASE_API;
```

### **4. 请求配置文件修改**

**修改 `src/utils/request.js`（或类似文件）：**

```javascript
// 原来的 Vue CLI 方式
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || "/api",
  timeout: 10000,
});

// 修改为 Vite 方式
const service = axios.create({
  baseURL: import.meta.env.VUE_APP_BASE_API || "/api",
  timeout: 10000,
});
```

**重要说明：**

- `process.env` → `import.meta.env`
- 只有以 `VITE_` 或配置的前缀开头的变量才会被暴露
- 环境变量在构建时被替换

### **5. HTML 文件处理**

**Vue CLI：**

```
public/
  index.html
src/
```

**Vite：**

```
根目录/
  index.html  # 移动到根目录
src/
```

**修改 index.html：**

```html
<!-- 原来的 -->
<script src="/js/chunk-vendors.js"></script>
<script src="/js/app.js"></script>

<!-- 现在：删除所有显式的脚本引入 -->
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <!-- Vite 会自动注入脚本 -->
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### **6. 静态资源引用方式**

**Vue CLI：**

```javascript
import logo from '@/assets/logo.png';
<img :src="logo" />

// 或
<img src="@/assets/logo.png" />
```

**Vite：**

```javascript
// 方式1：使用相对或绝对路径
<img src="/src/assets/logo.png" />

// 方式2：使用 import
import logoUrl from '@/assets/logo.png';
<img :src="logoUrl" />

// 方式3：使用 public 目录（不经过构建）
<img src="/logo.png" />  // 放在 public/logo.png
```

### **7. 路径别名配置**

**vite.config.js 中配置：**

```javascript
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // 可以添加更多别名
      "@components": path.resolve(__dirname, "./src/components"),
    },
  },
});
```

## 🔧 常见问题解决

### **问题 1：CommonJS 模块报错**

```javascript
// 错误：require is not defined
const module = require("module");

// 解决：改为 ES6 导入
import module from "module";
```

### **问题 2：process 变量报错**

```javascript
// 错误：process is not defined
if (process.env.NODE_ENV === "development") {
}

// 解决：使用 import.meta.env
if (import.meta.env.MODE === "development") {
}
```

### **问题 3：CSS 预处理器错误**

```javascript
// vite.config.js 中正确配置
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
});
```

## 📦 完整迁移脚本

```bash
#!/bin/bash
# migrate-to-vite.sh

echo "🚀 开始迁移 Vue CLI 到 Vite..."

# 1. 备份
echo "📦 备份原项目..."
cp -r ./ ./backup-$(date +%Y%m%d-%H%M%S)

# 2. 删除旧文件
echo "🗑️  删除旧配置文件..."
rm -f vue.config.js
rm -f babel.config.js

# 3. 清理依赖
echo "🧹 清理 node_modules..."
rm -rf node_modules
rm -f package-lock.json

# 4. 移动 HTML 文件
echo "📄 移动 HTML 文件..."
if [ -f "public/index.html" ]; then
    mv public/index.html ./
    rm -rf public
fi

# 5. 更新 package.json
echo "📝 更新 package.json..."
# 这里可以编写 sed 命令或手动修改

# 6. 创建 vite.config.js
echo "⚙️  创建 Vite 配置文件..."
cat > vite.config.js << 'EOF'
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8081,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
EOF

echo "✅ 迁移完成！"
echo "📦 请运行: npm install"
echo "🚀 然后运行: npm run dev"
```

## 📊 迁移前后对比

| 特性       | Vue CLI (Webpack) | Vite        |
| ---------- | ----------------- | ----------- |
| 启动速度   | 20-30 秒          | 1-3 秒      |
| 热更新     | 1-3 秒            | 50-300 毫秒 |
| 配置复杂度 | 复杂              | 简单        |
| 插件生态   | 成熟              | 快速增长    |
| 构建速度   | 中等              | 快速        |

## 🎯 迁移后的优势

1. **极速启动**：Vite 启动速度比 Vue CLI 快 10-100 倍
2. **闪电热更新**：无论项目大小，热更新几乎瞬间完成
3. **更简单配置**：配置文件更简洁易懂
4. **现代工具链**：原生支持 ES 模块、TypeScript 等
5. **更好的开发体验**：按需编译，无需等待整个应用构建

## 📚 总结

迁移到 Vite 确实是一个相对简单的过程，主要就是：

1. **改配置**：package.json + vite.config.js
2. **改代码**：环境变量访问方式
3. **改结构**：HTML 文件位置
4. **改引用**：静态资源导入方式
