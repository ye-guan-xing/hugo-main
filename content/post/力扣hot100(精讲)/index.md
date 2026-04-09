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

### 滑动窗口

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

#### [找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/description/)

\*暴力写法

```cpp
class Solution {
public:
    vector<int> findAnagrams(string s, string p) {
        sort(p.begin(), p.end());
        vector<int> ans;
        int len = p.size();
        int n = s.size();
        for (int l = 0; l + len <= n; l++) {
            string res = s.substr(l, len);
            sort(res.begin(), res.end());
            if (res == p) {
                ans.push_back(l);
            }
        }
        return ans;
    }
};
```

\*滑动窗口

```cpp
class Solution {
public:
    vector<int> findAnagrams(string s, string p) {
        vector<int> ans;
        vector<int>cnt1(26,0);
        vector<int>cnt2(26,0);
        int len=p.size();
        for(int i=0;i<p.size();i++){
            cnt1[p[i]-'a']++;
        }

        for(int r=0;r<s.size();r++){
            cnt2[s[r]-'a']++;
            int l=r-len+1;
            if(l<0) continue;
            if(cnt1==cnt2) ans.push_back(l);
            cnt2[s[l]-'a']--;
        }
        return ans;
    }
};
```

### 子串

#### [和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/description/)

\*思考过程：前缀和+哈希

```cpp
class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        int n=nums.size();
        vector<int>sum(n+1);
        for(int i=0;i<nums.size();i++){
            sum[i+1]=sum[i]+nums[i];
        }
        int ans=0;
        unordered_map<int,int>mp;
        mp[0]=1;
        for(int i=1;i<=n;i++){
            if(mp.find(sum[i]-k)!=mp.end()) ans+=mp[sum[i]-k];
            mp[sum[i]]++;
        }
        return ans;
    }
};
```

#### [滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/description/)

\*单调队列版子，没什么好说的

```cpp
class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int>q;
        vector<int>ans;
        for(int i=0;i<nums.size();i++){
            while(!q.empty()&&nums[q.back()]<nums[i]) q.pop_back();
            q.push_back(i);
            if(i>=k-1)//窗口长度为k，因为是从0开始，所以i-k+1为窗口的起始位置
            {
                while(!q.empty()&&q.front()<=i-k) q.pop_front();
                ans.push_back(nums[q.front()]);
            }
        }
        return ans;
    }
};
```

#### [最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/description/)

```cpp
#include<bits/stdc++.h>
class Solution {
public:
    string minWindow(string s, string t) {
        int n=s.size();
        int m=t.size();
        unordered_map<char,int>cnt_n,cnt;
        for(auto &x:t) cnt_n[x]++;
        int l=0,r=0;
        int need=0;
        int mi=INT_MAX;
        int st=0;
        while(r<n){
            char c=s[r++];
            if(cnt_n.count(c)){
                cnt[c]++;
                if(cnt[c]==cnt_n[c]) need++;
            }
            while(need==cnt_n.size()){
                if(r-l<mi){
                    st=l;
                    mi=r-l;
                }
                char d=s[l++];
                if(cnt_n.count(d)){
                    if(cnt[d]==cnt_n[d]) need--;
                    cnt[d]--;
                }
            }
        }
        return mi==INT_MAX?"":s.substr(st,mi);
    }
};
```

### 数组

#### [最大子数组和](https://leetcode.cn/problems/maximum-subarray/description/)

```cpp
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        vector<int>dp(nums.size());
        dp[0]=nums[0];
        for(int i=1;i<nums.size();i++){
            dp[i]=max(nums[i],dp[i-1]+nums[i]);
        }
        return *max_element(dp.begin(),dp.end());
    }
};
```

#### [合并区间](https://leetcode.cn/problems/merge-intervals/description/)

```cpp
// (要维护的)
//num[0][1]>nums[1][0]  3>2
//nums[0][0]<nums[1][0] 1<2
//比较 nums[0][1] 和 nums[1][1]
class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(),intervals.end());
        vector<vector<int>>ans;
        for(auto & p:intervals){
            if(!ans.empty()&&p[0]<=ans.back()[1]){
                ans.back()[1]=max(ans.back()[1],p[1]);
            }
            else ans.push_back(p);
        }
        return ans;
    }
};
```

#### [轮转数组](https://leetcode.cn/problems/rotate-array/description/)

```cpp
class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        int n=nums.size();
        k=k%n;
        reverse(nums.begin(),nums.end());
        reverse(nums.begin(),nums.begin()+k);
        reverse(nums.begin()+k,nums.end());
    }
};
```

#### [除了自身以外数组的乘积](https://leetcode.cn/problems/product-of-array-except-self/)

```cpp
class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n=nums.size();
        vector<int>pre(n,1);
        vector<int>suf(n,1);
        for(int i=1;i<n;i++){
            pre[i]=pre[i-1]*nums[i-1];
        }
        for(int i=n-2;i>=0;i--){
            suf[i]=suf[i+1]*nums[i+1];
        }
        vector<int>ans(n);
        for(int i=0;i<n;i++){
            ans[i]=pre[i]*suf[i];
        }
        return ans;
    }
};
```

#### [缺失的第一个正数](https://leetcode.cn/problems/first-missing-positive/description/)

> 时间复杂度O(n)，空间是O(n)

```cpp
class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        unordered_set<int> s;
        for (int num : nums) {
            if (num >0&&num<=n) {
                s.insert(num);
            }
        }
        int res=1;
        while(s.count(res)) res++;
        return res;
    }
};
```

> 仔细思考一下，最大可能是n+1,最小是1,可以假设是最大情况，最后发现第一个不符合题意的就是ans;

- for 跑 n 次，while 每次跑 n 次 → n×n = O (n²)，这是不对的，实际上只会交换n次，时间复杂度是O(n)

> 这是并行次数，不是嵌套次数

```cpp
class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        int n=nums.size();
        for(int i=0;i<n;i++){
            while(nums[i]>=1&&nums[i]<=n&&nums[nums[i]-1]!=nums[i]){
                swap(nums[i],nums[nums[i]-1]);
            }
        }
        for(int i=0;i<n;i++){
            if(nums[i]!=i+1) return i+1;
        }
        return n+1;
    }
};
```

### 矩阵

#### [矩阵置零](https://leetcode.cn/problems/set-matrix-zeroes/description/)

```cpp
class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m=matrix.size();int n=matrix[0].size();
        vector<bool>a(m);
        vector<bool>b(n);
        for(int i=0;i<m;i++){
            for(int j=0;j<n;j++){
                if(matrix[i][j]==0){
                    a[i]=b[j]=1;
                }
            }
        }
        for(int i=0;i<m;i++){
            for(int j=0;j<n;j++){
                if(a[i]==1||b[j]==1) matrix[i][j]=0;
            }
        }
    }
};
```

#### [螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/description/)

```cpp
class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        int l=0,r=matrix[0].size()-1;
        int top=0,bottom=matrix.size()-1;
        vector<int>ans;
        while(1){
            //左到右
            for(int i=l;i<=r;i++){
                ans.push_back(matrix[top][i]);
            }
            top++;
            if(top>bottom) break;

            //上到下
            for(int i=top;i<=bottom;i++){
                ans.push_back(matrix[i][r]);
            }
            r--;
            if(l>r) break;

            //右到左
            for(int i=r;i>=l;i--){
                ans.push_back(matrix[bottom][i]);
            }
            bottom--;
            if(top>bottom) break;

            //下到上
            for(int i=bottom;i>=top;i--){
                ans.push_back(matrix[i][l]);
            }
            l++;
            if(l>r) break;
        }
        return ans;
    }
};
```

#### [旋转图像](https://leetcode.cn/problems/rotate-image/description/)

```cpp
class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n=matrix.size();
        for(int i=0;i<n;i++){
            for(int j=0;j<i;j++){
                if(i==j) continue;
                swap(matrix[i][j],matrix[j][i]);
            }
        }
        for(int i=0;i<n;i++){
            reverse(matrix[i].begin(),matrix[i].end());
        }
    }
};
```

#### [搜索二维矩阵 II](https://leetcode.cn/problems/search-a-2d-matrix-ii/description/)

```cpp
class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int top=0;
        int r=matrix[0].size()-1;
        while(top<=matrix.size()-1&&r>=0){
            if(matrix[top][r]==target){
                return true;
            }
            else if(matrix[top][r]>target){
                r--;
            }
            else if(matrix[top][r]<target){
                top++;
            }
        }
        return false;
    }
};
```

### 二叉树

- 遍历 顺序 最适合干什么？
- 前序 根左右 复制树、创建树
- 中序 左根右 BST 有序输出、找第 k 小
- 后序 左右根 求深度、求高度、删树

#### [二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/description/)

- 建议大家看一下 [模版](https://www.luogu.com.cn/problem/B3642#ide)

```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    void dfs(TreeNode* root,vector<int>& res){
        if(!root) return;
        dfs(root->left,res);
        res.push_back(root->val);
        dfs(root->right,res);
    }
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int>res;
        dfs(root,res);
        return res;
    }
};
```

#### [二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if(!root) return 0;
        int l=maxDepth(root->left);
        int r=maxDepth(root->right);
        return max(l,r)+1;
    }
};
```

#### [对称二叉树](https://leetcode.cn/problems/symmetric-tree/description/?)

```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    bool dfs(TreeNode* p,TreeNode* q){
        if(!p||!q) return p==q;
        return (p->val==q->val)&&dfs(p->left,q->right)&&dfs(p->right,q->left);
    }
    bool isSymmetric(TreeNode* root) {
        if(!root) return true;
        bool ans=dfs(root->left,root->right);
        return ans;
    }
};
```

#### [二叉树的直径](https://leetcode.cn/problems/diameter-of-binary-tree/description/)

```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    int ans=0;
    int dfs(TreeNode* root){
        if(!root) return 0;
        int l=dfs(root->left);
        int r=dfs(root->right);
        ans=max(ans,l+r);
        return max(l,r)+1;
    }
    int diameterOfBinaryTree(TreeNode* root) {
        if(!root) return 0;
        dfs(root);
        return ans;
    }
};
```

#### [翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/description/)

```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        //边界
        if(!root) return nullptr;
        //子问题
        TreeNode* l=invertTree(root->left);
        TreeNode* r=invertTree(root->right);
        root->left=r;
        root->right=l;
        return root;
    }
};
```

#### [二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

- dfs

```cpp
class Solution {
public:
    void dfs(TreeNode* root,int depth,vector<vector<int>>& res){
        if(!root) return;
        if(res.size()==depth) res.push_back({});
        res[depth].push_back(root->val);
        dfs(root->left,depth+1,res);
        dfs(root->right,depth+1,res);
    }
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>>res;
        dfs(root,0,res);
        return res;
    }
};
```

- bfs

```cpp
class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>>ans;
        if(!root) return ans;
        queue<TreeNode*>q;
        q.push(root);
        while(!q.empty()){
            vector<int>val;
            int n=q.size();
            for(int i=0;i<n;i++){
                auto node=q.front();
                q.pop();
                val.push_back(node->val);
                if(node->left) q.push(node->left);
                if(node->right) q.push(node->right);
            }
            ans.push_back(val);
        }
        return ans;
    }
};
```
