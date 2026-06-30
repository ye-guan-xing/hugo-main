---
draft: flase
date: 2026-04-10 01:00:00
slug: "leetcode-hot100-part3"
title: "力扣hot100(精讲三)"
categories: ["算法"]
tags: ["C++"]
---

## 说明

- 我这里写个是为了做一下整理
- 我觉得有趣，如果开发累了，可以换一换脑子
- 注：题目可直抵题目，所以不写题目内容

## 题目讲解

### 回溯

#### [全排列](https://leetcode.cn/problems/permutations/description/)

```cpp
class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        int n=nums.size();
        vector<bool>vis(n);
        vector<vector<int>>ans;
        vector<int>res;
        auto dfs=[&](auto&& self,int x)->void{
            if(x==n){
                ans.push_back(res);
                return;
            }
            for(int i=0;i<n;i++){
                if(vis[i]) continue;

                vis[i]=1;
                res.push_back(nums[i]);

                self(self,x+1);

                res.pop_back();
                vis[i]=0;
            }
        };
        dfs(dfs,0);
        return ans;
    }
};
```

#### [括号生成](https://leetcode.cn/problems/generate-parentheses/description/)

```cpp
class Solution {
public:
    vector<string> generateParenthesis(int n) {
        vector<string>ans;
        vector<char> res(n * 2);

        auto dfs=[&](auto &&self,int l,int r){
            if(r==n){
                ans.push_back(string(res.begin(), res.end()));
                return;
            }
            if(l<n){
                res[l+r]='(';
                self(self,l+1,r);
            }
            if(r<l){
                res[l+r]=')';
                self(self,l,r+1);
            }
        };

        dfs(dfs,0,0);
        return ans;
    }
};
```
