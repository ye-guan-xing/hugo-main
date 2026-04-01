---
draft: flase
date: 2026-04-01 01:00:00
title: "力扣hot100(精讲)"
categories: ["算法"]
tags: ["C++"]
---

## 说明

- 我这里写个是为了做一下整理
- 我觉得有趣，如果开发累了，可以换一换脑子
- 注：题目可直抵题目，所以不写题目内容

## 题目讲解

### 哈希：快速映射和快速查找

#### [两数之和](https://leetcode.cn/problems/two-sum/)

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

#### [字母异位词分组](https://leetcode.cn/problems/group-anagrams/description/)

- 思路：哈希表，将字符串排序，作为键，将原字符串作为值，然后遍历字符串，将排序后的字符串作为键，将原字符串作为值，如果哈希表中存在目标值，则返回结果，否则返回-1
- 时间复杂度：O(n)

```cpp
class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string,vector<string>>m;
        for(string& s:strs){
            string s1=s;
            sort(s1.begin(),s1.end());
            m[s1].push_back(s);
        }

        vector<vector<string>>ans;
        ans.reserve(m.size());
        for(auto & [x,value]:m){
            ans.push_back(value);
        }
        return ans;
    }
};
```

####[最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence/description/)

```cpp
class Solution {
    public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int>st(nums.begin(),nums.end());
        int ans=0;
        for(int x:st){
            if(!st.count(x-1)){
                continue;
            }
            int now=x;
            int cnt=1;
            while(st.count(now+1)){
                now++；
                cnt++;
            }
            ans=max(ans,cnt);
        }
        return ans;
    }
}
```

### 双指针

#### [移动零](https://leetcode.cn/problems/move-zeroes/description/)

- 思路：双指针，一个指针指向当前位置，一个指针指向下一个位置，如果当前位置为0，则将下一个位置的值赋给当前位置，然后将下一个位置指针后移一位，直到下一个位置为0，然后将当前位置指针后移一位，直到数组末尾

```cpp
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int l=0,r=1;
        if(nums.size()==1) return;
        while(r<nums.size()){
            if(nums[l]!=0){
                l++;
            }
            if(nums[l]==0){
                if(nums[r]!=0){
                    swap(nums[l],nums[r]);
                    l++;
                }
            }
            r++;
        }
    }
};
```

#### [盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/description/)

```cpp
class Solution {
public:
    int maxArea(vector<int>& height) {
        int l=0,r=height.size()-1;
        int ans=0;
        while(l<r){
            if(height[l]>=height[r]){
                ans=max(ans,height[r]*(r-l));
                r--;
            }
            else{
                ans=max(ans,height[l]*(r-l));
                l++;
            }
        }
        return ans;
    }
};
```

#### [三数之和](https://leetcode.cn/problems/3sum/description/)

```cpp
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        vector<vector<int>>ans;
        int n=nums.size();
        sort(nums.begin(),nums.end());
        for(int i=0;i<n;i++){
            if(nums[i]>0) break;
            if(i>0&&nums[i]==nums[i-1]) continue;
            int l=i+1,r=n-1;
            while(l<r){
                int sum=nums[i]+nums[l]+nums[r];
                if(sum==0){
                    ans.push_back({nums[i],nums[l],nums[r]});
                    while(l<r&&nums[l]==nums[l+1]) l++;
                    while(l<r&&nums[r]==nums[r-1]) r--;
                    l++,r--;
                }
                else if(sum>0) r--;
                else l++;
            }
        }
        return ans;
    }
};
```

####[接雨水](https://leetcode.cn/problems/trapping-rain-water/description/)

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

###滑动窗口

#### [无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/)

```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int l=0;
        unordered_map<char,int>mp;
        int ans=0;
        for(int i=0;i<s.length();i++){
            char c=s[i];
            mp[c]++;
            while(mp[c]>1){
                mp[s[l]]--;
                l++;
            }
            ans=max(ans,i-l+1);
        }
        return ans;
    }
};
```
