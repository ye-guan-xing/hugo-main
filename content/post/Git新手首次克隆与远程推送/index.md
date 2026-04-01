---
draft: false
date: 2026-04-01 00:00:00
title: "Git 新手第一次使用：克隆、配置远程与首次推送"
categories: ["Git 新手通关指南"]
---

# Git 新手第一次使用：克隆、配置远程与首次推送

## 1. 克隆仓库到本地

```bash
git clone https://github.com/username/repo.git
cd repo
```

## 2. 查看当前远程仓库地址

```bash
git remote -v
```

你会看到类似：

- `origin  https://github.com/username/repo.git (fetch)`
- `origin  https://github.com/username/repo.git (push)`

## 3. 设置或修改远程仓库地址

### 场景 A：已经有 `origin`，只想修改地址

```bash
git remote set-url origin https://github.com/yourname/new-repo.git
```

### 场景 B：没有 `origin`，第一次添加远程地址

```bash
git remote add origin https://github.com/yourname/new-repo.git
```

修改后再次检查：

```bash
git remote -v
```

## 4. 首次提交并推送

先把改动提交到本地仓库：

```bash
git add .
git commit -m "init project"
```

再首次推送到远程分支：

```bash
git push -u origin main
```

如果你的默认分支叫 `master`，则使用：

```bash
git push -u origin master
```

`-u` 的作用是建立本地分支和远程分支的追踪关系。设置后，后续可以直接使用：

```bash
git push
git pull
```

## 5. 常见检查命令

```bash
git status
git branch
git log --oneline
```
