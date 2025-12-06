---
draft: flase
date: 2025-11-30 12:36:00 +0800
title: "校园OJ开发之admin页面的开发"
categories: ["校园OJ开发", "web开发"]
tags: ["前端开发"]
---

由于没有后端，我来为你添加前端模拟数据和模拟 API，并解释为什么不需要处理 token。

## 1. 创建模拟数据存储

首先在 `src/utils/` 下创建模拟数据管理工具：

### `src/utils/mockData.js`

```javascript
// 模拟数据存储
class MockStorage {
  constructor() {
    this.storageKey = "oj_mock_data";
    this.initData();
  }

  initData() {
    if (!localStorage.getItem(this.storageKey)) {
      const initialData = {
        problems: [
          {
            id: 1,
            title: "两数之和",
            label: "数组,哈希表,简单",
            testPointNum: 3,
            description:
              "给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回它们的数组下标。\n\n你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。",
            testPointList: [
              { input: "3\n2 7 11 15\n9", output: "0 1", isSample: 1 },
              { input: "2\n3 2 4\n6", output: "1 2", isSample: 0 },
              { input: "2\n3 3\n6", output: "0 1", isSample: 0 },
            ],
            createTime: "2024-01-15 10:00:00",
          },
          {
            id: 2,
            title: "验证回文串",
            label: "字符串,双指针,简单",
            testPointNum: 6,
            description:
              "给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。\n\n说明：本题中，我们将空字符串定义为有效的回文串。",
            testPointList: [
              {
                input: '"A man, a plan, a canal: Panama"',
                output: "true",
                isSample: 1,
              },
              { input: '"race a car"', output: "false", isSample: 1 },
              { input: '""', output: "true", isSample: 0 },
            ],
            createTime: "2024-01-16 14:30:00",
          },
        ],
        nextProblemId: 3,
      };
      this.saveData(initialData);
    }
  }

  getData() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || {};
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // 获取所有题目
  getProblems() {
    return this.getData().problems || [];
  }

  // 添加题目
  addProblem(problem) {
    const data = this.getData();
    const newProblem = {
      ...problem,
      id: data.nextProblemId++,
      createTime: new Date().toLocaleString("zh-CN"),
    };
    data.problems.push(newProblem);
    this.saveData(data);
    return newProblem;
  }

  // 更新题目
  updateProblem(updatedProblem) {
    const data = this.getData();
    const index = data.problems.findIndex((p) => p.id === updatedProblem.id);
    if (index !== -1) {
      data.problems[index] = {
        ...data.problems[index],
        ...updatedProblem,
        // 保留创建时间
        createTime: data.problems[index].createTime,
      };
      this.saveData(data);
      return data.problems[index];
    }
    return null;
  }

  // 删除题目
  deleteProblem(id) {
    const data = this.getData();
    data.problems = data.problems.filter((p) => p.id !== id);
    this.saveData(data);
    return true;
  }

  // 分页查询
  getProblemsByPage(pageNum = 1, size = 10) {
    const problems = this.getProblems();
    const start = (pageNum - 1) * size;
    const end = start + size;
    const pageData = problems.slice(start, end);

    return {
      records: pageData,
      total: problems.length,
      pageNum,
      size,
    };
  }

  // 根据ID查询
  getProblemById(id) {
    const problems = this.getProblems();
    return problems.find((p) => p.id === Number(id));
  }
}

// 创建单例实例
export const mockStorage = new MockStorage();
```

## 2. 修改 API 文件支持模拟数据

### `src/api/admin.js` (更新版本)

```javascript
import request from "@/utils/request";
import { mockStorage } from "@/utils/mockData";

// 是否使用模拟数据
const USE_MOCK = true;

// 模拟延迟
const mockDelay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// 题目管理接口
export const problemAdminAPI = {
  // 添加题目
  addProblem: async (data) => {
    if (USE_MOCK) {
      await mockDelay();
      const result = mockStorage.addProblem(data);
      return { data: result, code: 200, message: "添加成功" };
    }

    return request({
      url: "/testQuestion/addTestQuestion",
      method: "POST",
      data,
    });
  },

  // 删除题目
  deleteProblem: async (id) => {
    if (USE_MOCK) {
      await mockDelay();
      const success = mockStorage.deleteProblem(id);
      return {
        data: null,
        code: success ? 200 : 400,
        message: success ? "删除成功" : "删除失败",
      };
    }

    return request({
      url: "/testQuestion/deleteTestQuestionById",
      method: "DELETE",
      data: { id },
    });
  },

  // 更新题目
  updateProblem: async (data) => {
    if (USE_MOCK) {
      await mockDelay();
      const result = mockStorage.updateProblem(data);
      if (result) {
        return { data: result, code: 200, message: "更新成功" };
      } else {
        return { data: null, code: 400, message: "题目不存在" };
      }
    }

    return request({
      url: "/testQuestion/updateTestQuestion",
      method: "POST",
      data,
    });
  },

  // 题目分页查询
  getProblemsByPage: async (params) => {
    if (USE_MOCK) {
      await mockDelay(300);
      const { pageNum = 1, size = 10, keyword } = params;

      let problems = mockStorage.getProblems();

      // 模拟搜索功能
      if (keyword) {
        problems = problems.filter(
          (p) =>
            p.title.toLowerCase().includes(keyword.toLowerCase()) ||
            p.label.toLowerCase().includes(keyword.toLowerCase())
        );
      }

      const start = (pageNum - 1) * size;
      const end = start + size;
      const pageData = problems.slice(start, end);

      return {
        data: {
          records: pageData,
          total: problems.length,
          pageNum,
          size,
        },
        code: 200,
        message: "查询成功",
      };
    }

    return request({
      url: "/testQuestion/getTestQuestionByPage",
      method: "GET",
      params,
    });
  },

  // 根据ID查询题目
  getProblemById: async (id) => {
    if (USE_MOCK) {
      await mockDelay();
      const problem = mockStorage.getProblemById(id);
      if (problem) {
        return { data: problem, code: 200, message: "查询成功" };
      } else {
        return { data: null, code: 404, message: "题目不存在" };
      }
    }

    return request({
      url: "/testQuestion/getTestQuestionById",
      method: "GET",
      params: { id },
    });
  },
};
```

## 3. 更新组件处理模拟数据响应

### `src/components/admin/ProblemManagement.vue` (关键部分更新)

```javascript
// 在 fetchProblems 方法中更新数据处理：
const fetchProblems = async () => {
  loading.value = true;
  try {
    const params = {
      pageNum: pagination.value.pageNum,
      size: pagination.value.size,
    };

    if (searchKeyword.value) {
      params.keyword = searchKeyword.value;
    }

    const response = await problemAdminAPI.getProblemsByPage(params);

    // 处理模拟数据和真实数据的响应格式差异
    if (USE_MOCK) {
      problemList.value = response.data.records || [];
      pagination.value.total = response.data.total || 0;
    } else {
      problemList.value = response.data?.records || [];
      pagination.value.total = response.data?.total || 0;
    }
  } catch (error) {
    ElMessage.error("获取题目列表失败");
    console.error("获取题目列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 在 handleDelete 方法中：
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm("确定要删除这个题目吗？", "警告", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    });

    const response = await problemAdminAPI.deleteProblem(id);

    // 检查响应是否成功
    if (response.code === 200) {
      ElMessage.success("删除成功");
      fetchProblems();
    } else {
      ElMessage.error(response.message || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
      console.error("删除失败:", error);
    }
  }
};
```

### `src/components/admin/ProblemForm.vue` (关键部分更新)

```javascript
// 在 handleSubmit 方法中更新：
const handleSubmit = async () => {
  try {
    await formRef.value.validate();

    submitting.value = true;

    // 更新测试点数量
    form.testPointNum = form.testPointList.length;

    const response = isEdit.value
      ? await problemAdminAPI.updateProblem(form)
      : await problemAdminAPI.addProblem(form);

    // 检查响应是否成功
    if (response.code === 200) {
      ElMessage.success(isEdit.value ? "更新成功" : "创建成功");
      router.push("/admin/problem");
    } else {
      ElMessage.error(
        response.message || (isEdit.value ? "更新失败" : "创建失败")
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(isEdit.value ? "更新失败" : "创建失败");
      console.error("提交失败:", error);
    }
    // 如果是验证失败，不显示错误消息
  } finally {
    submitting.value = false;
  }
};

// 在 fetchProblemDetail 方法中更新：
const fetchProblemDetail = async (id) => {
  try {
    const response = await problemAdminAPI.getProblemById(id);
    if (response.code === 200 && response.data) {
      Object.assign(form, response.data);
    } else {
      ElMessage.error(response.message || "获取题目详情失败");
    }
  } catch (error) {
    ElMessage.error("获取题目详情失败");
    console.error("获取题目详情失败:", error);
  }
};
```

## 4. 为什么不需要处理 Token

### 原因分析：

1. **模拟环境特性**：

   - 在模拟环境中，所有数据都存储在前端（localStorage）
   - 不需要与真实服务器通信，因此不需要身份验证
   - 数据操作完全在前端完成，没有跨域或安全限制

2. **开发阶段便利性**：

   - 简化开发流程，专注于功能实现
   - 避免因认证问题阻碍开发进度
   - 便于测试和演示

3. **架构设计考虑**：
   - 保持 API 接口的一致性
   - 真实环境切换简单（只需修改 `USE_MOCK` 常量）
   - 模拟数据层与业务逻辑分离

### 真实环境切换：

当需要连接真实后端时，只需：

1. 将 `src/api/admin.js` 中的 `USE_MOCK` 改为 `false`
2. 确保 `src/utils/request.js` 中的 token 处理正常工作
3. 配置正确的后端 API 地址

### Token 处理的预备工作：

虽然在模拟环境中不需要 token，但你的项目已经具备了 token 处理能力：

```javascript
// 在 src/utils/request.js 中已经有类似的代码：
import store from "@/store";

// 请求拦截器 - 添加 token
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers["Authorization"] = `Bearer ${store.getters.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

这样设计确保了：

- **开发阶段**：快速原型开发，无需后端依赖
- **生产环境**：无缝切换到真实 API，自动处理认证
- **代码质量**：保持接口一致性，便于维护

现在你的题目管理功能已经完全可以在前端独立运行，所有数据都会持久化保存在浏览器的 localStorage 中！
