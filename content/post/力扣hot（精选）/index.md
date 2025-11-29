---
draft: flase
date: 2025-11-28 8:36:00 +0800
title: "力扣hot150(精讲)"
categories: ["算法"]
tags: ["C++"]
---

## 说明

- 我这里写个是为了做一下整理
- 我觉得有趣，如果开发累了，可以换一换脑子
- 注：题目可直抵题目，所以不写题目内容

## 题目讲解

### [两数之和](https://leetcode.cn/problems/two-sum/)

- 哈哈哈,虽然这是讲 hot150,但是这道题还是 要说说的

1. 暴力法
   暴力法就是遍历所有数，然后两两相加，如果和等于目标值，则返回结果，否则返回-1

```cpp
class Solution {
public:
    vector<int> twoSum(std::vector<int>& nums, int target) {
        int n = nums.size();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (nums[i] + nums[j] == target) {
                    return {i, j};
                }
            }
        }
        return {};
    }
};
```

2. 哈希表

- 哈希表就是将数组中的数作为键，索引作为值，然后遍历数组，将每个数作为键，索引作为值，如果哈希表中存在目标值，则返回结果，否则返回-1
- 时间复杂度：O(n) 为什么可以优化时间呢？
  > 因为哈希表的查找时间杂度是 O(1)，而数组的查找时间复杂度是 O(n)，所以哈希表可以提高查找效率。

```cpp
class Solution {
public:
    vector<int> twoSum(std::vector<int>& nums, int target) {
        int n = nums.size();
        unordered_map<int,int>mp;
        for(int i=0;i<n;i++){
            if(mp.find(target-nums[i])!=mp.end()){
                return {i,mp[target-nums[i]]};
            }
            mp[nums[i]]=i;
        }
        return {};
    }
};
```

### 删除有序数组中的重复项

- 这里将 I 和 II 的解法都给出，并给出过程

#### [题目 I](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/)

- 我的想法是这样的，没什么好说的，stl 大法好

```cpp
class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        nums.erase(unique(nums.begin(),nums.end()),nums.end());
        return nums.size();
    }
};
```

- 如果不能用呢？用快慢指针，慢指针最后的位置就是去重后的数组长度，可以优化空间复杂度<del>虽然空间不值钱</del>

```cpp
class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        int k=0;
        for(int i=0;i<nums.size();i++){
            if(nums[i]!=nums[k]){
                k++;
                nums[k]=nums[i];
            }
        }
        return k+1;//从0开始计数
    }
};
```

#### [题目 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-array-ii/)

- 我的思路：遍历数组，判断当前元素是否和前两个元素相同，相同则跳过，不同则赋给下一个位置<del>好像也是双指针</del>

```cpp
class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        int n=nums.size();
        if(n<=2) return n;
        int j=2;
        for(int i=2;i<n;i++){
            if(nums[i]!=nums[j-2]){
                nums[j]=nums[i];
                j++;
            }
        //相同则跳过
        }
    return j;
    }
};
```

* 双指针思路：同一的快慢指针思路，只是判断条件不同   O(n)
```cpp
class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        int n=nums.size();
        if(n<=2) return n;
        int j=0;
        int cnt=1;
        for(int i=1;i<n;i++){
            if(nums[i]==nums[j]){
                if(cnt>=2) continue;
                cnt++;
                j++;
                nums[j]=nums[i];
            }
            else{
                cnt=1;
                j++;
                nums[j]=nums[i];
            }
        }
        return j+1;
    }
};
```
### [O(1) 时间插入、删除和获取随机元素](https://leetcode-cn.com/problems/insert-delete-getrandom-o1/)
* 说实话我不会，这是我想的，算暴力吧
```cpp
class RandomizedSet {
public:
    RandomizedSet() {
        srand(time(0));
    }
    int find(int val){
        for(int i = 0; i < a.size(); i++){
            if (a[i] == val){
                return i;
            }
        }
        return -1;
    }
    bool insert(int val) {
        int loc=find(val);
        if(loc==-1){
            a.push_back(val);
            return 1;
        }
        return 0;
    }
    
    bool remove(int val) {
        int loc=find(val);
        if(loc==-1) return 0;
        else{
            a.erase(a.begin()+loc);
            return 1;
        }
    }
    int getRandom() {
        if(a.size()==0) return 0;
        return a[rand()%a.size()];
    }
    public:
    vector<int>a;
};
```
* 过了好一段时间，才想到的哈希
```cpp
class RandomizedSet {
public:
    unordered_map<int, int> mp; 
    vector<int> a; 
    RandomizedSet() {
        srand(time(0)); 
    }

    int find(int val) {
        if (mp.count(val)) { 
            return mp[val];
        }
        return -1;
    }

    bool insert(int val) {
        if (find(val) != -1) {
            return false;
        }
        a.push_back(val);
        mp[val] = a.size() - 1; //这两步写完，才算完成。
        return true;
    }

    bool remove(int val) {
        int loc = find(val);
        if (loc == -1) {
            return false;
        }

        int last = a.back(); 
        a[loc] = last; 
        mp[last] = loc; 
        
        mp.erase(val);
        a.pop_back();
        return true;
    }

    int getRandom() {
        if (a.empty()) return 0;
        return a[rand() % a.size()];
    }
};
```
* 讲解一下remove()方法(不太好想)
> 先明确两个前提：
* 数组a的特点：尾部增删元素（push_back/pop_back）是 O (1) 时间，但中间删除元素（erase）是 O (n) 时间（因为后面的元素要整体前移）。
* 哈希表mp的作用：记录 “元素值→数组索引”，比如mp[3]=2表示元素 3 在数组a的索引 2 位置。
你可能觉得 “元素要相连才合理”，但的核心需求是：
插入 / 删除 / 随机访问都是 O (1)；
元素不重复。
它不要求元素保持任何顺序，所以哪怕用 “八竿子打不着的最后一个元素” 替换，只要最终删掉了目标元素，且哈希表映射正确，就完全符合要求。
* 其实你想想这是一个误区，数组的顺序反而不重要

### [接雨水](https://leetcode-cn.com/problems/trapping-rain-water/)
* 网红题目,不必多言<del>据说字节的扫地阿姨都会做</del>
* 我的思路：<del>其实我不理解为什么说难</del>看一个柱子能接多少水，应该就能想到贪心+双指针/单调栈
```cpp
class Solution {
public:
    int trap(vector<int>& height) {
        int lmax=0,rmax=0;
        int l=0,r=height.size()-1;
        int n=height.size();
        int ans=0;
        while(l<r){
            lmax=max(lmax,height[l]);
            rmax=max(rmax,height[r]);
            if(lmax>rmax) {
                ans+=rmax-height[r];
                r--;
            }
            else{
                ans+=lmax-height[l];
                l++;
            }
        }
        return ans;
    }
};
```