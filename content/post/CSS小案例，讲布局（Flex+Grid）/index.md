---
draft: false
date: 2025-12-14 22:36:00 +0800
title: "CSS小案例，讲布局（Flex+Grid）"
categories: ["web开发"]
tags: ["项目开发"]
---

# 从新闻页面 CSS+成果图看布局设计：实用 Flex 与结构化布局技巧

在前端开发中，布局是页面的骨架，直接决定了内容呈现的逻辑性和视觉舒适度。最近落地了一个新闻列表页面（如下成果图所示），其布局设计简洁高效，尤其适合信息密集型页面（如新闻、资讯类），今天就结合**成果图+对应 CSS 代码**，拆解其中的布局思路和实用技巧。

（注：下图即为本次分析对应的页面成果，后续会一一对应布局模块）
![新闻页面成果图](/images/flex布局/image.png)

## 一、布局基础：全局样式与容器搭建（成果图整体框架）

任何布局的第一步都是打“地基”——成果图里的整个内容区域，就是通过以下代码实现的核心容器：

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background: orange;
  background-attachment: fixed;
  padding-top: 25px;
}
.big_box {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(180deg, #f0f0f0 0%, whitesmoke 100%);
  border-radius: 20px;
}
```

### 对应成果图的效果：

- 成果图里的所有内容（左侧新闻+右侧热搜）都包裹在`big_box`中，实现了**水平居中+左右留白**，适配不同屏幕；
- 容器的渐变背景+圆角，让成果图里的内容区和外部橙色背景区分开，视觉更整洁。

## 二、核心布局：Flex 的灵活运用（成果图主次分栏+内容排列）

成果图的“左主新闻区+右热搜区”“单图/多图新闻”等结构，全靠 Flex 布局实现：

### 1. 主次分栏布局（成果图左+右区域）

```css
.box {
  max-width: 1200px;
  display: flex;
  gap: 50px;
  align-items: flex-start;
}
.left {
  flex: 1;
} /* 成果图左侧主新闻区 */
.right {
  width: 360px;
  flex-shrink: 0;
} /* 成果图右侧热搜区 */
```

### 对应成果图的效果：

- 左侧主区（`left`）自动占满剩余空间，呈现多条新闻；右侧热搜区（`right`）固定宽度不收缩，保证榜单布局稳定（成果图右侧的热搜列表不会被挤压）；
- 两者顶部对齐（`align-items: flex-start`），对应成果图里左、右区域的顶部是齐平的。

### 2. 单图新闻布局（成果图“2024 高考倒计时”那条）

```css
.row_box {
  display: flex;
  gap: 16px;
}
.img1 {
  width: 32%;
  aspect-ratio: 4/3;
  flex-shrink: 0;
  border-radius: 8px;
}
.text_box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
```

### 对应成果图的效果：

- 成果图里“2024 高考倒计时”左侧的空白块，就是`img1`（固定宽占比+比例），不会因文本长度变形；
- 右侧文本区上下分布（标题在上、时间/来源在下），对应成果图里这条新闻的文字区域布局均匀。

### 3. 多图新闻布局（成果图第三条新闻的三个图）

```css
.img3_box {
  display: flex;
  gap: 6px;
  margin: 10px 0;
}
.img3 {
  flex: 1;
  aspect-ratio: 16/10;
  border-radius: 6px;
}
```

### 对应成果图的效果：

成果图第三条新闻下方的三个空白块，就是通过`flex: 1`实现的**均等分栏**，无需手动算宽度，保证三张图整齐排列。

### 4. 热搜榜单布局（成果图右侧列表）

```css
.hot_li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 14px;
}
.rank {
  width: 18px;
  flex-shrink: 0;
  font-weight: 700;
}
.hot_text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 对应成果图的效果：

- 成果图右侧的“1、2、3...”排名，是`rank`（固定宽度不位移）；
- 超长热搜标题自动省略（比如成果图里的第一条热搜），避免换行打乱布局。

## 三、布局设计的核心思路总结（结合成果图）

这个页面的布局之所以在成果图里呈现得清晰舒适，核心是“结构化+灵活性”的平衡：

1. **先骨架后内容**：先通过`big_box`/`box`定整体框架（成果图的大容器+分栏），再填内部组件；
2. **Flex 适配场景**：分栏用 Flex、单图/多图用 Flex、榜单用 Flex，替代浮动/定位，代码简洁且适配成果图的各种排列需求；
3. **固定+灵活结合**：热搜区/图片/排名固定（保证成果图里的关键区域稳定），主新闻区灵活伸缩（适配不同屏幕）；
4. **细节控体验**：文本省略、统一间距、固定比例，让成果图里的布局既规整又不呆板。
