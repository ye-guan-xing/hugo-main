---
draft: true
date: 2025-10-20 16:36:00 +0800
title: '全域生活服务平台开发流程详解'
categories: ["web开发"]
tags : ['项目开发', '全栈开发']
---
# 全域生活服务平台 - 从零开始完整开发指南

## 🎯 项目概述
我们将构建一个完整的全域生活服务平台，包含：
- **Web管理后台**：管理员管理商家、服务、订单
- **微信小程序**：用户浏览服务、下单
- **后端API**：Node.js + Express + MySQL
- **数据库**：MySQL，使用DataGrip管理

---

## 🛠️ 阶段一：项目准备与环境搭建

### 第1步：安装必要软件

#### 1.1 安装 Node.js（后端运行环境）
- 访问：https://nodejs.org
- 下载 **LTS版本**（长期支持版）
- 双击安装，全部点"下一步"
- **验证安装**：按 `Win + R`，输入 `cmd` 回车，输入：
```bash
node -v
```
显示版本号如 `v18.x.x` 即成功！

#### 1.2 安装 Vue CLI（网页管理后台工具）
在cmd中继续输入：
```bash
npm install -g @vue/cli
```
等待安装完成（可能需要几分钟）

#### 1.3 安装微信开发者工具（小程序开发）
- 访问：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
- 下载"稳定版"，安装后用微信扫码登录

#### 1.4 安装 MySQL（数据库）
- 访问：https://dev.mysql.com/downloads/mysql/
- 下载 MySQL Community Server
- 安装时记住设置的**root密码**（建议设为 `123456`）

#### 1.5 安装 DataGrip（数据库可视化工具）
- 访问：https://www.jetbrains.com/datagrip/
- 下载安装，学生可免费使用（用教育邮箱注册）
- 或使用30天免费试用

### 第2步：创建项目文件夹结构
在D盘创建项目文件夹：
```
D:/life-service/
├── server/          （后端API）
├── web-admin/       （网页管理后台）
└── mini-user/       （微信小程序）
```

### 第3步：配置 DataGrip 连接数据库

#### 3.1 连接 MySQL
1. 打开 DataGrip，点击 **"New Project"**
2. 项目名称：`life_service_platform`
3. 在右侧 "Database" 面板，点击 **"+"** → **"Data Source"** → **"MySQL"**
4. 填写连接信息：
   ```
   Host: localhost
   Port: 3306
   User: root
   Password: 123456 （你设置的MySQL密码）
   ```
5. 点击 **"Test Connection"**，看到 ✅ **Success** 表示成功
6. 点击 **"OK"**

#### 3.2 创建数据库
在 DataGrip 中执行 SQL 创建数据库：
1. 按 `Ctrl+Enter` 打开新查询窗口
2. 输入并执行：
```sql
CREATE DATABASE IF NOT EXISTS life_service 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;
```

#### 3.3 创建数据表
在 DataGrip 中执行以下 SQL 创建表：
```sql
-- 1. 商家表
CREATE TABLE merchants (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '商家ID',
  name VARCHAR(100) NOT NULL COMMENT '商家名称',
  address VARCHAR(200) NOT NULL COMMENT '地址',
  phone VARCHAR(20) NOT NULL COMMENT '联系方式',
  status TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-审核中，1-已通过',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) COMMENT '商家表';

-- 2. 服务表
CREATE TABLE services (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '服务ID',
  merchant_id INT NOT NULL COMMENT '关联商家ID',
  name VARCHAR(100) NOT NULL COMMENT '服务名称',
  price DECIMAL(10,2) NOT NULL COMMENT '价格',
  category VARCHAR(50) NOT NULL COMMENT '分类',
  image_url VARCHAR(200) COMMENT '图片地址',
  stock INT NOT NULL DEFAULT 0 COMMENT '库存',
  status TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-下架，1-上架',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
) COMMENT '服务表';

-- 3. 订单表
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID',
  service_id INT NOT NULL COMMENT '关联服务ID',
  user_name VARCHAR(50) NOT NULL COMMENT '用户姓名',
  user_phone VARCHAR(20) NOT NULL COMMENT '用户电话',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
  status TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-待支付，1-已完成',
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
) COMMENT '订单表';
```

#### 3.4 插入测试数据
```sql
-- 插入测试商家
INSERT INTO merchants (name, address, phone, status) VALUES 
('阳光家政', '北京市朝阳区建国路100号', '13800138000', 1),
('快速维修', '上海市浦东新区张江路200号', '13900139000', 1),
('保洁专家', '广州市天河区体育西路300号', '13700137000', 1);

-- 插入测试服务
INSERT INTO services (merchant_id, name, price, category, stock, status) VALUES 
(1, '日常保洁', 150.00, '家政', 10, 1),
(1, '深度清洁', 300.00, '家政', 5, 1),
(2, '空调维修', 200.00, '维修', 8, 1),
(3, '办公室保洁', 500.00, '保洁', 3, 1);
```

---

## 💻 阶段二：后端API开发（2-3天）

### 第1步：创建后端项目
1. 打开cmd，进入server文件夹：
```bash
cd D:/life-service/server
```

2. 初始化项目：
```bash
npm init -y
```

3. 安装依赖包：
```bash
npm install express mysql2 cors nodemon
```

### 第2步：创建项目文件结构
在 `server` 文件夹中创建以下文件结构：
```
server/
├── app.js           （主入口文件）
├── db/
│   └── index.js     （数据库连接）
├── routes/
│   ├── merchant.js  （商家接口）
│   ├── service.js   （服务接口）
│   └── order.js     （订单接口）
└── controllers/
    ├── merchantCtrl.js
    ├── serviceCtrl.js
    └── orderCtrl.js
```

### 第3步：编写后端代码

#### 3.1 数据库连接配置 (db/index.js)
```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',  // 改成你的MySQL密码
  database: 'life_service',
  port: 3306
});

console.log('✅ 数据库连接成功！');
module.exports = pool;
```

#### 3.2 主入口文件 (app.js)
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// 中间件
app.use(express.json());
app.use(cors());

// 引入路由
const merchantRouter = require('./routes/merchant');
const serviceRouter = require('./routes/service'); 
const orderRouter = require('./routes/order');

// 使用路由
app.use('/api/merchant', merchantRouter);
app.use('/api/service', serviceRouter);
app.use('/api/order', orderRouter);

// 启动服务
app.listen(3000, () => {
  console.log('✅ 后端服务启动成功！');
  console.log('📍 访问地址: http://localhost:3000');
});
```

#### 3.3 商家控制器 (controllers/merchantCtrl.js)
```javascript
const pool = require('../db');

// 新增商家
exports.addMerchant = async (req, res) => {
  const { name, address, phone } = req.body;
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO merchants (name, address, phone) VALUES (?, ?, ?)',
      [name, address, phone]
    );
    
    res.json({ 
      code: 200, 
      msg: '新增商家成功！', 
      data: { id: result.insertId } 
    });
  } catch (err) {
    res.json({ 
      code: 500, 
      msg: '服务器出错啦', 
      error: err.message 
    });
  }
};

// 获取商家列表
exports.getMerchants = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM merchants');
    res.json({ 
      code: 200, 
      data: rows 
    });
  } catch (err) {
    res.json({ 
      code: 500, 
      msg: '获取商家列表失败', 
      error: err.message 
    });
  }
};
```

#### 3.4 商家路由 (routes/merchant.js)
```javascript
const express = require('express');
const router = express.Router();
const merchantCtrl = require('../controllers/merchantCtrl');

// 新增商家
router.post('/add', merchantCtrl.addMerchant);

// 获取商家列表  
router.get('/list', merchantCtrl.getMerchants);

module.exports = router;
```

#### 3.5 服务控制器 (controllers/serviceCtrl.js)
```javascript
const pool = require('../db');

// 获取服务列表
exports.getServices = async (req, res) => {
  const { category } = req.query;
  
  try {
    let sql = `
      SELECT s.*, m.name as merchant_name 
      FROM services s 
      LEFT JOIN merchants m ON s.merchant_id = m.id 
      WHERE s.status = 1
    `;
    let params = [];
    
    if (category && category !== '全部') {
      sql += ' AND s.category = ?';
      params.push(category);
    }
    
    const [rows] = await pool.execute(sql, params);
    res.json({ 
      code: 200, 
      data: rows 
    });
  } catch (err) {
    res.json({ 
      code: 500, 
      msg: '获取服务列表失败', 
      error: err.message 
    });
  }
};

// 新增服务
exports.addService = async (req, res) => {
  const { merchant_id, name, price, category, image_url, stock } = req.body;
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO services (merchant_id, name, price, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [merchant_id, name, price, category, image_url, stock]
    );
    
    res.json({ 
      code: 200, 
      msg: '新增服务成功！', 
      data: { id: result.insertId } 
    });
  } catch (err) {
    res.json({ 
      code: 500, 
      msg: '新增服务失败', 
      error: err.message 
    });
  }
};
```

#### 3.6 服务路由 (routes/service.js)
```javascript
const express = require('express');
const router = express.Router();
const serviceCtrl = require('../controllers/serviceCtrl');

// 获取服务列表
router.get('/list', serviceCtrl.getServices);

// 新增服务
router.post('/add', serviceCtrl.addService);

module.exports = router;
```

#### 3.7 订单控制器 (controllers/orderCtrl.js)
```javascript
const pool = require('../db');

// 创建订单
exports.createOrder = async (req, res) => {
  const { service_id, user_name, user_phone } = req.body;
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO orders (service_id, user_name, user_phone) VALUES (?, ?, ?)',
      [service_id, user_name, user_phone]
    );
    
    res.json({ 
      code: 200, 
      msg: '订单创建成功！', 
      data: { id: result.insertId } 
    });
  } catch (err) {
    res.json({ 
      code: 500, 
      msg: '创建订单失败', 
      error: err.message 
    });
  }
};

// 获取订单列表
exports.getOrders = async (req, res) => {
  const { status } = req.query;
  
  try {
    let sql = `
      SELECT o.*, s.name as service_name, s.price, m.name as merchant_name 
      FROM orders o 
      LEFT JOIN services s ON o.service_id = s.id 
      LEFT JOIN merchants m ON s.merchant_id = m.id 
      WHERE 1=1
    `;
    let params = [];
    
    if (status !== undefined) {
      sql += ' AND o.status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY o.create_time DESC';
    
    const [rows] = await pool.execute(sql, params);
    res.json({ 
      code: 200, 
      data: rows 
    });
  } catch (err) {
    res.json({ 
      code: 500, 
      msg: '获取订单列表失败', 
      error: err.message 
    });
  }
};
```

#### 3.8 订单路由 (routes/order.js)
```javascript
const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orderCtrl');

// 创建订单
router.post('/create', orderCtrl.createOrder);

// 获取订单列表
router.get('/list', orderCtrl.getOrders);

module.exports = router;
```

### 第4步：配置 package.json 脚本
修改 `server/package.json` 中的 `scripts` 部分：
```json
{
  "scripts": {
    "dev": "nodemon app.js",
    "start": "node app.js"
  }
}
```

### 第5步：启动后端服务
```bash
cd D:/life-service/server
npm run dev
```
看到 `✅ 后端服务启动成功！` 表示后端正常运行。

### 第6步：测试后端API
使用 Postman 或浏览器测试接口：
- `GET http://localhost:3000/api/merchant/list` - 获取商家列表
- `POST http://localhost:3000/api/merchant/add` - 新增商家

---

## 🌐 阶段三：Web管理后台开发（3-4天）

### 第1步：创建Vue项目
1. 打开新的cmd窗口：
```bash
cd D:/life-service
vue create web-admin
```

2. 选择配置：
   - `Vue 3`
   - `Babel`
   - `Router`
   - 其他按回车用默认配置

3. 进入项目并安装依赖：
```bash
cd web-admin
npm install axios
```

### 第2步：项目结构配置
在 `src` 文件夹中创建以下结构：
```
src/
├── api/
│   ├── merchant.js
│   ├── service.js
│   └── order.js
├── components/
├── views/
│   ├── Merchant/
│   │   └── index.vue
│   ├── Service/
│   │   └── index.vue
│   └── Order/
│       └── index.vue
└── router/
    └── index.js
```

### 第3步：配置路由
修改 `src/router/index.js`：
```javascript
import { createRouter, createWebHistory } from 'vue-router';
import Merchant from '../views/Merchant/index.vue';
import Service from '../views/Service/index.vue';
import Order from '../views/Order/index.vue';

const routes = [
  { path: '/', redirect: '/merchant' },
  { path: '/merchant', component: Merchant, name: '商家管理' },
  { path: '/service', component: Service, name: '服务管理' },
  { path: '/order', component: Order, name: '订单管理' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
```

### 第4步：封装API请求
创建 `src/api/merchant.js`：
```javascript
import axios from 'axios';

// 配置基础路径
axios.defaults.baseURL = 'http://localhost:3000/api';

// 商家相关API
export const merchantAPI = {
  // 新增商家
  addMerchant: (data) => {
    return axios.post('/merchant/add', data);
  },
  
  // 获取商家列表
  getMerchants: () => {
    return axios.get('/merchant/list');
  }
};

export default merchantAPI;
```

创建 `src/api/service.js`：
```javascript
import axios from 'axios';

export const serviceAPI = {
  // 获取服务列表
  getServices: (category = '') => {
    const params = category ? { category } : {};
    return axios.get('/service/list', { params });
  },
  
  // 新增服务
  addService: (data) => {
    return axios.post('/service/add', data);
  }
};

export default serviceAPI;
```

创建 `src/api/order.js`：
```javascript
import axios from 'axios';

export const orderAPI = {
  // 获取订单列表
  getOrders: (status) => {
    const params = status !== undefined ? { status } : {};
    return axios.get('/order/list', { params });
  },
  
  // 创建订单
  createOrder: (data) => {
    return axios.post('/order/create', data);
  }
};

export default orderAPI;
```

### 第5步：开发商家管理页面
创建 `src/views/Merchant/index.vue`：
```vue
<template>
  <div class="merchant-page">
    <h2>🏪 商家管理</h2>
    
    <!-- 新增商家表单 -->
    <div class="add-form">
      <h3>➕ 新增商家</h3>
      <div class="form-group">
        <input v-model="newMerchant.name" placeholder="商家名称" class="input">
        <input v-model="newMerchant.address" placeholder="商家地址" class="input">
        <input v-model="newMerchant.phone" placeholder="联系电话" class="input">
        <button @click="addMerchant" class="btn btn-primary">添加商家</button>
      </div>
    </div>

    <!-- 商家列表 -->
    <div class="merchant-list">
      <h3>📋 商家列表</h3>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>名称</th>
            <th>地址</th>
            <th>电话</th>
            <th>状态</th>
            <th>创建时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="merchant in merchants" :key="merchant.id">
            <td>{{ merchant.id }}</td>
            <td>{{ merchant.name }}</td>
            <td>{{ merchant.address }}</td>
            <td>{{ merchant.phone }}</td>
            <td>
              <span :class="merchant.status === 0 ? 'status-pending' : 'status-approved'">
                {{ merchant.status === 0 ? '审核中' : '已通过' }}
              </span>
            </td>
            <td>{{ formatTime(merchant.create_time) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import merchantAPI from '../../api/merchant'

export default {
  name: 'MerchantView',
  setup() {
    const merchants = ref([])
    const newMerchant = ref({
      name: '',
      address: '', 
      phone: ''
    })

    // 获取商家列表
    const getMerchants = async () => {
      try {
        const response = await merchantAPI.getMerchants()
        merchants.value = response.data.data
      } catch (error) {
        alert('获取商家列表失败！')
        console.error(error)
      }
    }

    // 新增商家
    const addMerchant = async () => {
      if (!newMerchant.value.name || !newMerchant.value.address || !newMerchant.value.phone) {
        alert('请填写完整信息！')
        return
      }

      try {
        await merchantAPI.addMerchant(newMerchant.value)
        alert('商家添加成功！')
        
        // 清空表单
        newMerchant.value = { name: '', address: '', phone: '' }
        
        // 刷新列表
        getMerchants()
      } catch (error) {
        alert('添加商家失败！')
        console.error(error)
      }
    }

    // 格式化时间
    const formatTime = (timeString) => {
      return new Date(timeString).toLocaleString()
    }

    // 页面加载时获取数据
    onMounted(() => {
      getMerchants()
    })

    return {
      merchants,
      newMerchant,
      addMerchant,
      formatTime
    }
  }
}
</script>

<style scoped>
.merchant-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.add-form {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  background: #f9f9f9;
}

.form-group {
  display: flex;
  gap: 10px;
  align-items: end;
  flex-wrap: wrap;
}

.input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
  min-width: 200px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
}

.merchant-list {
  margin-top: 30px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.table th {
  background: #f5f5f5;
  font-weight: bold;
}

.status-pending {
  color: #ff9800;
  font-weight: bold;
}

.status-approved {
  color: #4caf50;
  font-weight: bold;
}
</style>
```

### 第6步：修改App.vue
更新 `src/App.vue`：
```vue
<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="nav-title">全域生活服务平台</h1>
        <div class="nav-links">
          <router-link to="/merchant" class="nav-link">商家管理</router-link>
          <router-link to="/service" class="nav-link">服务管理</router-link>
          <router-link to="/order" class="nav-link">订单管理</router-link>
        </div>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f5f5;
}

.navbar {
  background: #2c3e50;
  color: white;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.nav-title {
  font-size: 24px;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 15px 20px;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-link:hover, .nav-link.router-link-active {
  background: #34495e;
}

.main-content {
  min-height: calc(100vh - 60px);
  padding: 20px;
}
</style>
```

### 第7步：开发服务管理页面
创建 `src/views/Service/index.vue`：
```vue
<template>
  <div class="service-page">
    <h2>🛎️ 服务管理</h2>
    
    <!-- 新增服务表单 -->
    <div class="add-form">
      <h3>➕ 新增服务</h3>
      <div class="form-grid">
        <input v-model="newService.name" placeholder="服务名称" class="input">
        <select v-model="newService.merchant_id" class="input">
          <option value="">选择商家</option>
          <option v-for="merchant in merchants" :key="merchant.id" :value="merchant.id">
            {{ merchant.name }}
          </option>
        </select>
        <input v-model="newService.price" type="number" placeholder="价格" class="input">
        <select v-model="newService.category" class="input">
          <option value="">选择分类</option>
          <option value="家政">家政</option>
          <option value="维修">维修</option>
          <option value="保洁">保洁</option>
        </select>
        <input v-model="newService.stock" type="number" placeholder="库存" class="input">
        <input v-model="newService.image_url" placeholder="图片URL" class="input">
        <button @click="addService" class="btn btn-primary">添加服务</button>
      </div>
    </div>

    <!-- 服务列表 -->
    <div class="service-list">
      <h3>📋 服务列表</h3>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>服务名称</th>
            <th>商家</th>
            <th>价格</th>
            <th>分类</th>
            <th>库存</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in services" :key="service.id">
            <td>{{ service.id }}</td>
            <td>{{ service.name }}</td>
            <td>{{ service.merchant_name }}</td>
            <td>¥{{ service.price }}</td>
            <td>{{ service.category }}</td>
            <td>{{ service.stock }}</td>
            <td>
              <span :class="service.status === 0 ? 'status-off' : 'status-on'">
                {{ service.status === 0 ? '下架' : '上架' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import serviceAPI from '../../api/service'
import merchantAPI from '../../api/merchant'

export default {
  name: 'ServiceView',
  setup() {
    const services = ref([])
    const merchants = ref([])
    const newService = ref({
      name: '',
      merchant_id: '',
      price: '',
      category: '',
      stock: '',
      image_url: ''
    })

    // 获取服务列表
    const getServices = async () => {
      try {
        const response = await serviceAPI.getServices()
        services.value = response.data.data
      } catch (error) {
        alert('获取服务列表失败！')
        console.error(error)
      }
    }

    // 获取商家列表
    const getMerchants = async () => {
      try {
        const response = await merchantAPI.getMerchants()
        merchants.value = response.data.data
      } catch (error) {
        alert('获取商家列表失败！')
        console.error(error)
      }
    }

    // 新增服务
    const addService = async () => {
      if (!newService.value.name || !newService.value.merchant_id || !newService.value.price) {
        alert('请填写完整信息！')
        return
      }

      try {
        await serviceAPI.addService(newService.value)
        alert('服务添加成功！')
        
        // 清空表单
        newService.value = {
          name: '',
          merchant_id: '',
          price: '',
          category: '',
          stock: '',
          image_url: ''
        }
        
        // 刷新列表
        getServices()
      } catch (error) {
        alert('添加服务失败！')
        console.error(error)
      }
    }

    // 页面加载时获取数据
    onMounted(() => {
      getServices()
      getMerchants()
    })

    return {
      services,
      merchants,
      newService,
      addService
    }
  }
}
</script>

<style scoped>
.service-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.add-form {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  background: #f9f9f9;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  align-items: end;
}

.input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  grid-column: 1 / -1;
  justify-self: start;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
}

.service-list {
  margin-top: 30px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.table th {
  background: #f5f5f5;
  font-weight: bold;
}

.status-on {
  color: #4caf50;
  font-weight: bold;
}

.status-off {
  color: #f44336;
  font-weight: bold;
}
</style>
```

### 第8步：开发订单管理页面
创建 `src/views/Order/index.vue`：
```vue
<template>
  <div class="order-page">
    <h2>📦 订单管理</h2>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <h3>筛选条件</h3>
      <div class="filter-group">
        <label>
          <input type="radio" v-model="filterStatus" value=""> 全部订单
        </label>
        <label>
          <input type="radio" v-model="filterStatus" value="0"> 待支付
        </label>
        <label>
          <input type="radio" v-model="filterStatus" value="1"> 已完成
        </label>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="order-list">
      <h3>订单列表</h3>
      <table class="table">
        <thead>
          <tr>
            <th>订单ID</th>
            <th>服务名称</th>
            <th>商家</th>
            <th>用户姓名</th>
            <th>用户电话</th>
            <th>价格</th>
            <th>状态</th>
            <th>下单时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.service_name }}</td>
            <td>{{ order.merchant_name }}</td>
            <td>{{ order.user_name }}</td>
            <td>{{ order.user_phone }}</td>
            <td>¥{{ order.price }}</td>
            <td>
              <span :class="order.status === 0 ? 'status-pending' : 'status-completed'">
                {{ order.status === 0 ? '待支付' : '已完成' }}
              </span>
            </td>
            <td>{{ formatTime(order.create_time) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import orderAPI from '../../api/order'

export default {
  name: 'OrderView',
  setup() {
    const orders = ref([])
    const filterStatus = ref('')

    // 获取订单列表
    const getOrders = async (status = '') => {
      try {
        const response = await orderAPI.getOrders(status)
        orders.value = response.data.data
      } catch (error) {
        alert('获取订单列表失败！')
        console.error(error)
      }
    }

    // 格式化时间
    const formatTime = (timeString) => {
      return new Date(timeString).toLocaleString()
    }

    // 监听筛选条件变化
    watch(filterStatus, (newStatus) => {
      getOrders(newStatus)
    })

    // 页面加载时获取数据
    onMounted(() => {
      getOrders()
    })

    return {
      orders,
      filterStatus,
      formatTime
    }
  }
}
</script>

<style scoped>
.order-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.filter-section {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  background: #f9f9f9;
}

.filter-group {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.filter-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.order-list {
  margin-top: 30px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.table th {
  background: #f5f5f5;
  font-weight: bold;
}

.status-pending {
  color: #ff9800;
  font-weight: bold;
}

.status-completed {
  color: #4caf50;
  font-weight: bold;
}
</style>
```

### 第9步：启动Web管理后台
```bash
cd D:/life-service/web-admin
npm run serve
```
访问：http://localhost:8080

---

## 📱 阶段四：微信小程序开发（3-4天）

### 第1步：创建小程序项目
1. 打开微信开发者工具
2. 点击"新建项目"
3. 填写信息：
   - 项目名称：`生活服务平台`
   - 目录：选择 `D:/life-service/mini-user`
   - AppID：点击"测试号"
   - 后端服务：不使用云服务
4. 点击"新建"

### 第2步：项目结构配置
在小程序项目中创建以下结构：
```
mini-user/
├── pages/
│   ├── index/（首页）
│   ├── serviceList/（服务列表）
│   ├── orderCreate/（创建订单）
│   └── orderList/（订单列表）
├── utils/
│   └── request.js（请求封装）
├── images/（图片资源）
└── app.js（小程序入口）
```

### 第3步：封装网络请求
创建 `utils/request.js`：
```javascript
const request = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://localhost:3000/api' + url,
      method,
      data,
      success: (res) => {
        if (res.data.code === 200) {
          resolve(res.data.data)
        } else {
          reject(res.data.msg)
        }
      },
      fail: (err) => {
        reject('网络请求失败：' + err.errMsg)
      }
    })
  })
}

module.exports = request
```

### 第4步：配置小程序页面
修改 `app.json`：
```json
{
  "pages": [
    "pages/index/index",
    "pages/serviceList/serviceList",
    "pages/orderCreate/orderCreate",
    "pages/orderList/orderList"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#2c3e50",
    "navigationBarTitleText": "生活服务平台",
    "navigationBarTextStyle": "white"
  },
  "style": "v2",
  "sitemapLocation": "sitemap.json"
}
```

### 第5步：开发首页
创建 `pages/index/index.js`：
```javascript
const request = require('../../utils/request')

Page({
  data: {
    services: [],
    categories: [
      { name: '家政', icon: '🏠', type: '家政' },
      { name: '维修', icon: '🔧', type: '维修' },
      { name: '保洁', icon: '✨', type: '保洁' }
    ]
  },

  onLoad() {
    this.getServices()
  },

  // 获取推荐服务
  async getServices() {
    try {
      const services = await request('/service/list')
      // 只取前4个作为推荐
      this.setData({ 
        services: services.slice(0, 4) 
      })
    } catch (err) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 跳转到服务列表
  toServiceList(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/serviceList/serviceList?type=${type}`
    })
  },

  // 跳转到订单列表
  toOrderList() {
    wx.navigateTo({
      url: '/pages/orderList/orderList'
    })
  }
})
```

创建 `pages/index/index.wxml`：
```xml
<view class="container">
  <!-- 头部 -->
  <view class="header">
    <text class="title">生活服务平台</text>
    <text class="subtitle">便捷生活，一键送达</text>
  </view>

  <!-- 服务分类 -->
  <view class="category-section">
    <view class="section-title">服务分类</view>
    <view class="category-grid">
      <view 
        class="category-item" 
        wx:for="{{categories}}" 
        wx:key="type"
        bindtap="toServiceList"
        data-type="{{item.type}}"
      >
        <text class="category-icon">{{item.icon}}</text>
        <text class="category-name">{{item.name}}</text>
      </view>
    </view>
  </view>

  <!-- 推荐服务 -->
  <view class="recommend-section">
    <view class="section-header">
      <text class="section-title">推荐服务</text>
      <text class="more" bindtap="toServiceList" data-type="">查看更多</text>
    </view>
    <view class="service-grid">
      <view 
        class="service-card" 
        wx:for="{{services}}" 
        wx:key="id"
        bindtap="toOrderCreate"
        data-service="{{item}}"
      >
        <image class="service-image" src="{{item.image_url || '/images/default-service.png'}}"></image>
        <view class="service-info">
          <text class="service-name">{{item.name}}</text>
          <text class="service-merchant">{{item.merchant_name}}</text>
          <view class="service-bottom">
            <text class="service-price">¥{{item.price}}</text>
            <text class="service-category">{{item.category}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>

  <!-- 底部导航 -->
  <view class="bottom-nav">
    <view class="nav-item" bindtap="toServiceList" data-type="">
      <text class="nav-icon">🔍</text>
      <text class="nav-text">全部服务</text>
    </view>
    <view class="nav-item" bindtap="toOrderList">
      <text class="nav-icon">📦</text>
      <text class="nav-text">我的订单</text>
    </view>
  </view>
</view>
```

创建 `pages/index/index.wxss`：
```css
.container {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

/* 头部样式 */
.header {
  text-align: center;
  margin: 40rpx 0 60rpx;
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10rpx;
}

.subtitle {
  display: block;
  font-size: 28rpx;
  color: #7f8c8d;
}

/* 分类区域 */
.category-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 30rpx;
  display: block;
}

.category-grid {
  display: flex;
  justify-content: space-around;
  background: white;
  padding: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-icon {
  font-size: 60rpx;
  margin-bottom: 15rpx;
}

.category-name {
  font-size: 28rpx;
  color: #2c3e50;
}

/* 推荐服务 */
.recommend-section {
  margin-bottom: 100rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.more {
  font-size: 28rpx;
  color: #3498db;
}

.service-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.service-card {
  background: white;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
}

.service-image {
  width: 100%;
  height: 200rpx;
  background: #ecf0f1;
}

.service-info {
  padding: 20rpx;
}

.service-name {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10rpx;
}

.service-merchant {
  display: block;
  font-size: 24rpx;
  color: #7f8c8d;
  margin-bottom: 15rpx;
}

.service-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-price {
  color: #e74c3c;
  font-size: 28rpx;
  font-weight: bold;
}

.service-category {
  font-size: 24rpx;
  color: #3498db;
  background: #ecf0f1;
  padding: 5rpx 15rpx;
  border-radius: 20rpx;
}

/* 底部导航 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  padding: 20rpx;
  box-shadow: 0 -2rpx 20rpx rgba(0,0,0,0.1);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-icon {
  font-size: 40rpx;
  margin-bottom: 10rpx;
}

.nav-text {
  font-size: 24rpx;
  color: #2c3e50;
}
```

### 第6步：开发服务列表页面
创建 `pages/serviceList/serviceList.js`：
```javascript
const request = require('../../utils/request')

Page({
  data: {
    services: [],
    categories: ['全部', '家政', '维修', '保洁'],
    activeCategory: '全部',
    searchKeyword: ''
  },

  onLoad(options) {
    if (options.type) {
      this.setData({ activeCategory: options.type })
    }
    this.getServices()
  },

  // 获取服务列表
  async getServices() {
    const { activeCategory, searchKeyword } = this.data
    
    try {
      let category = activeCategory === '全部' ? '' : activeCategory
      let services = await request('/service/list', 'GET', { category })
      
      // 前端搜索过滤
      if (searchKeyword) {
        services = services.filter(service => 
          service.name.includes(searchKeyword) || 
          service.merchant_name.includes(searchKeyword)
        )
      }
      
      this.setData({ services })
    } catch (err) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 切换分类
  switchCategory(e) {
    const category = e.currentTarget.dataset.category
    this.setData({ 
      activeCategory: category,
      searchKeyword: ''
    })
    this.getServices()
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
  },

  // 执行搜索
  onSearch() {
    this.getServices()
  },

  // 跳转到下单页面
  toOrderCreate(e) {
    const service = e.currentTarget.dataset.service
    wx.navigateTo({
      url: `/pages/orderCreate/orderCreate?service=${JSON.stringify(service)}`
    })
  }
})
```

创建 `pages/serviceList/serviceList.wxml`：
```xml
<view class="container">
  <!-- 搜索框 -->
  <view class="search-box">
    <input 
      class="search-input" 
      placeholder="搜索服务或商家..." 
      value="{{searchKeyword}}"
      bindinput="onSearchInput"
    />
    <button class="search-btn" bindtap="onSearch">搜索</button>
  </view>

  <!-- 分类筛选 -->
  <scroll-view class="category-scroll" scroll-x>
    <view class="category-list">
      <view 
        class="category-item {{activeCategory === item ? 'active' : ''}}"
        wx:for="{{categories}}"
        wx:key="*this"
        bindtap="switchCategory"
        data-category="{{item}}"
      >
        {{item}}
      </view>
    </view>
  </scroll-view>

  <!-- 服务列表 -->
  <view class="service-list">
    <view 
      class="service-item" 
      wx:for="{{services}}" 
      wx:key="id"
      bindtap="toOrderCreate"
      data-service="{{item}}"
    >
      <image class="service-image" src="{{item.image_url || '/images/default-service.png'}}"></image>
      <view class="service-content">
        <view class="service-header">
          <text class="service-name">{{item.name}}</text>
          <text class="service-price">¥{{item.price}}</text>
        </view>
        <view class="service-merchant">{{item.merchant_name}}</view>
        <view class="service-footer">
          <text class="service-category">{{item.category}}</text>
          <text class="service-stock">库存: {{item.stock}}</text>
        </view>
      </view>
    </view>
  </view>

  <!-- 空状态 -->
  <view class="empty-state" wx:if="{{services.length === 0}}">
    <text class="empty-text">暂无服务</text>
  </view>
</view>
```

创建 `pages/serviceList/serviceList.wxss`：
```css
.container {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

/* 搜索框 */
.search-box {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.search-input {
  flex: 1;
  background: white;
  padding: 20rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
}

.search-btn {
  background: #3498db;
  color: white;
  border: none;
  border-radius: 10rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
}

/* 分类筛选 */
.category-scroll {
  white-space: nowrap;
  margin-bottom: 30rpx;
}

.category-list {
  display: inline-flex;
  gap: 20rpx;
}

.category-item {
  display: inline-block;
  padding: 15rpx 30rpx;
  background: white;
  border-radius: 30rpx;
  font-size: 28rpx;
  color: #666;
}

.category-item.active {
  background: #3498db;
  color: white;
}

/* 服务列表 */
.service-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.service-item {
  display: flex;
  background: white;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
}

.service-image {
  width: 200rpx;
  height: 200rpx;
  background: #ecf0f1;
}

.service-content {
  flex: 1;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15rpx;
}

.service-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #2c3e50;
  flex: 1;
  margin-right: 20rpx;
}

.service-price {
  font-size: 32rpx;
  color: #e74c3c;
  font-weight: bold;
}

.service-merchant {
  font-size: 26rpx;
  color: #7f8c8d;
  margin-bottom: 15rpx;
}

.service-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-category {
  font-size: 24rpx;
  color: #3498db;
  background: #ecf0f1;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}

.service-stock {
  font-size: 24rpx;
  color: #95a5a6;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 100rpx 0;
}

.empty-text {
  font-size: 32rpx;
  color: #bdc3c7;
}
```

### 第7步：开发创建订单页面
创建 `pages/orderCreate/orderCreate.js`：
```javascript
const request = require('../../utils/request')

Page({
  data: {
    service: null,
    userInfo: {
      name: '',
      phone: ''
    }
  },

  onLoad(options) {
    if (options.service) {
      const service = JSON.parse(options.service)
      this.setData({ service })
    }
  },

  // 输入用户姓名
  onNameInput(e) {
    this.setData({
      'userInfo.name': e.detail.value
    })
  },

  // 输入用户电话
  onPhoneInput(e) {
    this.setData({
      'userInfo.phone': e.detail.value
    })
  },

  // 提交订单
  async submitOrder() {
    const { service, userInfo } = this.data
    
    if (!userInfo.name.trim()) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }

    if (!userInfo.phone.trim()) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }

    // 简单的手机号验证
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(userInfo.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    try {
      wx.showLoading({
        title: '提交中...'
      })

      await request('/order/create', 'POST', {
        service_id: service.id,
        user_name: userInfo.name,
        user_phone: userInfo.phone
      })

      wx.hideLoading()
      
      wx.showToast({
        title: '订单创建成功！',
        icon: 'success',
        duration: 2000
      })

      // 跳转到订单列表
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/orderList/orderList'
        })
      }, 2000)

    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: '订单创建失败',
        icon: 'none'
      })
    }
  }
})
```

创建 `pages/orderCreate/orderCreate.wxml`：
```xml
<view class="container">
  <!-- 服务信息 -->
  <view class="service-card" wx:if="{{service}}">
    <view class="card-title">服务信息</view>
    <view class="service-info">
      <image class="service-image" src="{{service.image_url || '/images/default-service.png'}}"></image>
      <view class="service-details">
        <text class="service-name">{{service.name}}</text>
        <text class="service-merchant">{{service.merchant_name}}</text>
        <text class="service-price">¥{{service.price}}</text>
      </view>
    </view>
  </view>

  <!-- 用户信息表单 -->
  <view class="form-card">
    <view class="card-title">填写订单信息</view>
    
    <view class="form-item">
      <text class="form-label">姓名</text>
      <input 
        class="form-input" 
        placeholder="请输入您的姓名" 
        value="{{userInfo.name}}"
        bindinput="onNameInput"
      />
    </view>

    <view class="form-item">
      <text class="form-label">手机号</text>
      <input 
        class="form-input" 
        placeholder="请输入您的手机号" 
        type="number"
        value="{{userInfo.phone}}"
        bindinput="onPhoneInput"
      />
    </view>
  </view>

  <!-- 提交按钮 -->
  <view class="submit-section">
    <view class="price-display">
      <text class="price-label">总计：</text>
      <text class="price-amount">¥{{service ? service.price : '0'}}</text>
    </view>
    <button class="submit-btn" bindtap="submitOrder">立即下单</button>
  </view>
</view>
```

创建 `pages/orderCreate/orderCreate.wxss`：
```css
.container {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 200rpx;
}

/* 卡片样式 */
.service-card, .form-card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 30rpx;
}

/* 服务信息 */
.service-info {
  display: flex;
  gap: 30rpx;
}

.service-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 10rpx;
  background: #ecf0f1;
}

.service-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.service-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #2c3e50;
}

.service-merchant {
  font-size: 26rpx;
  color: #7f8c8d;
}

.service-price {
  font-size: 36rpx;
  color: #e74c3c;
  font-weight: bold;
}

/* 表单样式 */
.form-item {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #ecf0f1;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  font-size: 30rpx;
  color: #2c3e50;
  width: 150rpx;
}

.form-input {
  flex: 1;
  font-size: 30rpx;
  color: #2c3e50;
}

/* 提交区域 */
.submit-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2rpx 20rpx rgba(0,0,0,0.1);
}

.price-display {
  display: flex;
  align-items: baseline;
}

.price-label {
  font-size: 28rpx;
  color: #2c3e50;
  margin-right: 10rpx;
}

.price-amount {
  font-size: 40rpx;
  color: #e74c3c;
  font-weight: bold;
}

.submit-btn {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50rpx;
  padding: 25rpx 60rpx;
  font-size: 32rpx;
  font-weight: bold;
}
```

### 第8步：开发订单列表页面
创建 `pages/orderList/orderList.js`：
```javascript
const request = require('../../utils/request')

Page({
  data: {
    orders: []
  },

  onLoad() {
    this.getOrders()
  },

  onShow() {
    this.getOrders()
  },

  // 获取订单列表
  async getOrders() {
    try {
      const orders = await request('/order/list')
      this.setData({ orders })
    } catch (err) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 格式化时间
  formatTime(timeString) {
    const date = new Date(timeString)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
})
```

创建 `pages/orderList/orderList.wxml`：
```xml
<view class="container">
  <view class="header">
    <text class="title">我的订单</text>
  </view>

  <view class="order-list">
    <view class="order-item" wx:for="{{orders}}" wx:key="id">
      <view class="order-header">
        <text class="order-no">订单号: {{item.id}}</text>
        <text class="order-status {{item.status === 0 ? 'pending' : 'completed'}}">
          {{item.status === 0 ? '待支付' : '已完成'}}
        </text>
      </view>
      
      <view class="order-content">
        <view class="service-info">
          <text class="service-name">{{item.service_name}}</text>
          <text class="merchant-name">{{item.merchant_name}}</text>
        </view>
        <text class="service-price">¥{{item.price}}</text>
      </view>

      <view class="order-footer">
        <text class="user-info">{{item.user_name}} · {{item.user_phone}}</text>
        <text class="order-time">{{formatTime(item.create_time)}}</text>
      </view>
    </view>
  </view>

  <view class="empty-state" wx:if="{{orders.length === 0}}">
    <text class="empty-text">暂无订单</text>
    <text class="empty-desc">去首页看看有什么服务吧</text>
  </view>
</view>
```

创建 `pages/orderList/orderList.wxss`：
```css
.container {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin: 40rpx 0;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #2c3e50;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.order-item {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #ecf0f1;
}

.order-no {
  font-size: 26rpx;
  color: #7f8c8d;
}

.order-status {
  font-size: 26rpx;
  font-weight: bold;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}

.order-status.pending {
  background: #fff3cd;
  color: #856404;
}

.order-status.completed {
  background: #d4edda;
  color: #155724;
}

.order-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.service-info {
  flex: 1;
}

.service-name {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10rpx;
}

.merchant-name {
  font-size: 26rpx;
  color: #7f8c8d;
}

.service-price {
  font-size: 36rpx;
  color: #e74c3c;
  font-weight: bold;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #ecf0f1;
}

.user-info {
  font-size: 26rpx;
  color: #2c3e50;
}

.order-time {
  font-size: 24rpx;
  color: #95a5a6;
}

.empty-state {
  text-align: center;
  padding: 100rpx 0;
}

.empty-text {
  display: block;
  font-size: 32rpx;
  color: #bdc3c7;
  margin-bottom: 20rpx;
}

.empty-desc {
  display: block;
  font-size: 28rpx;
  color: #bdc3c7;
}
```

### 第9步：配置小程序入口
修改 `app.js`：
```javascript
App({
  onLaunch() {
    console.log('小程序启动')
  },
  
  globalData: {
    userInfo: null
  }
})
```

---

## 🧪 阶段五：集成测试与上线

### 第1步：完整流程测试

#### 测试流程：
1. **启动所有服务**：
   ```bash
   # 终端1 - 后端
   cd D:/life-service/server
   npm run dev

   # 终端2 - 前端
   cd D:/life-service/web-admin  
   npm run serve
   ```

2. **在DataGrip中监控数据**：
   - 实时查看表数据变化
   - 验证外键关系

3. **测试完整业务流程**：
   - Web端：添加商家 → 添加服务
   - 小程序：浏览服务 → 下单
   - Web端：查看订单

### 第2步：代码优化

#### 后端优化：
1. 添加参数验证
2. 错误处理完善
3. 添加日志记录

#### 前端优化：
1. 加载状态提示
2. 错误边界处理
3. 表单验证加强

### 第3步：部署准备

#### 整理项目文档：
创建 `README.md`：
```markdown
# 全域生活服务平台

## 项目介绍
一个完整的生活服务平台，包含Web管理后台和微信小程序。

## 技术栈
- 后端：Node.js + Express + MySQL
- 前端：Vue 3 + Vue Router
- 小程序：微信小程序原生开发
- 数据库：MySQL 8.0
- 工具：DataGrip

## 启动步骤

### 后端
1. cd server
2. npm install
3. 修改 db/index.js 中的数据库密码
4. npm run dev

### Web管理后台
1. cd web-admin  
2. npm install
3. npm run serve

### 小程序
1. 微信开发者工具中打开 mini-user 文件夹
2. 点击预览
```

### 第4步：Git版本控制
```bash
# 初始化Git
cd D:/life-service
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "初始提交：完成全域生活服务平台开发"

# 推送到GitHub/Gitee
git remote add origin 你的仓库地址
git push -u origin main
```

---

## 🎉 项目完成！

### 你已掌握的技能：
✅ **全栈开发**：前端 + 后端 + 数据库  
✅ **多端开发**：Web + 微信小程序  
✅ **数据库设计**：MySQL表设计与关系  
✅ **API开发**：RESTful接口设计  
✅ **工具使用**：DataGrip数据库管理  

### 面试亮点：
- "独立完成从数据库设计到前后端开发的全流程"
- "掌握Vue + Node.js + MySQL技术栈整合"
- "具备多端开发能力（Web + 小程序）"
- "使用DataGrip进行专业的数据库管理"

### 下一步建议：
1. **功能扩展**：添加用户登录、支付功能
2. **性能优化**：添加缓存、分页查询
3. **部署上线**：购买云服务器部署项目
4. **持续学习**：学习TypeScript、Docker等进阶技术
