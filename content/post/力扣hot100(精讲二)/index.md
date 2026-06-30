---
draft: flase
date: 2026-04-06 01:00:00
slug: "leetcode-hot100-part2"
title: "力扣hot100(精讲二)"
categories: ["算法"]
tags: ["C++"]
---

## 说明

- 我这里写个是为了做一下整理
- 我觉得有趣，如果开发累了，可以换一换脑子
- 注：题目可直抵题目，所以不写题目内容

## 题目讲解[二叉树+图论]

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

#### [将有序数组转换为二叉搜索树](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/description/)

- 有序数组 = 从小到大一排数字
  取中间的数字当根节点 → 天然平衡（左右两边数字数量差不多）
  左边所有数字 → 构造左子树
  右边所有数字 → 构造右子树
  递归重复

```cpp
class Solution {
public:
    TreeNode* dfs(int l,int r,vector<int>& nums){
        if(l>r) return nullptr;

        int mid=(l+r)/2;
        //new TreeNode(...) → C++ 动态创建节点
        TreeNode* root=new TreeNode(nums[mid]);

        root->left=dfs(l,mid-1,nums);
        root->right=dfs(mid+1,r,nums);

        return root;
    }
    TreeNode* sortedArrayToBST(vector<int>& nums) {
        return dfs(0,nums.size()-1,nums);
    }
};
```

#### [验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/description/)

```cpp
class Solution {
public:
    bool dfs(long long l,long long r,TreeNode* root){
        if(!root) return 1;
        int val=root->val;
        return (l<val)&&(r>val)&&dfs(l,val,root->left)&&dfs(val,r,root->right);
    }
    bool isValidBST(TreeNode* root) {
        return dfs(-1e18,1e18,root);
    }
};
```

> cnt：全树共用一个数字 → 必须引用7
> l/r：每个节点一个独立范围 → 必须传值

#### [二叉搜索树中第 K 小的元素](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/description/)

```cpp
class Solution {
public:
    int ans = -1;
    int K;

    void dfs(TreeNode* root, int& cnt) {
        if (!root || ans != -1) return;

        dfs(root->left, cnt);
        cnt++;
        if (cnt == K) {
            ans = root->val;
            return;
        }
        dfs(root->right, cnt);
    }

    int kthSmallest(TreeNode* root, int k) {
        K = k;
        int cnt = 0;
        dfs(root, cnt);
        return ans;
    }
};
```

#### [二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/description/)

```cpp
class Solution {
public:
    void dfs(TreeNode* root,vector<int>& ans,int deep){
        if(!root) return;
        if(ans.size()==deep) ans.push_back(root->val);

        dfs(root->right,ans,deep+1);
        dfs(root->left,ans,deep+1);
    }
    vector<int> rightSideView(TreeNode* root) {
        vector<int>ans;
        dfs(root,ans,0);
        return ans;
    }
};
```

#### [二叉树展开为链表](https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/)

```cpp
class Solution {
public:
    void flatten(TreeNode* root) {
        if(!root) return;

        flatten(root->left);
        flatten(root->right);

        TreeNode* l=root->left;
        TreeNode* r=root->right;
        root->left=nullptr;
        root->right=l;

        while(root->right){
            root=root->right;
        }

        root->right=r;
    }
};
```

#### [从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

```cpp
class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        auto dfs=[&](auto&& self,vector<int>pre,vector<int>in)->TreeNode* {
            if(pre.empty()) return nullptr;

            TreeNode* root=new TreeNode(pre[0]);
            int mid=find(in.begin(),in.end(),pre[0])-in.begin();

            root->left=self(self,
            vector(pre.begin()+1,pre.begin()+1+mid),
            vector(in.begin(), in.begin()+mid)
            );

            root->right=self(self,
            vector(pre.begin()+1+mid,pre.end()),
            vector(in.begin()+1+mid,in.end())
            );

            return root;
        };
        return dfs(dfs,preorder,inorder);
    }
};
```

#### [从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/description/)

```cpp
class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        auto dfs=[&](auto&& self,vector<int>pre,vector<int>in)->TreeNode* {
            if(pre.empty()) return nullptr;

            TreeNode* root=new TreeNode(pre[0]);
            int mid=find(in.begin(),in.end(),pre[0])-in.begin();

            root->left=self(self,
            vector(pre.begin()+1,pre.begin()+1+mid),
            vector(in.begin(), in.begin()+mid)
            );

            root->right=self(self,
            vector(pre.begin()+1+mid,pre.end()),
            vector(in.begin()+1+mid,in.end())
            );

            return root;
        };
        return dfs(dfs,preorder,inorder);
    }
};
```

#### [路径总和 III](https://leetcode.cn/problems/path-sum-iii/description/)

```cpp
class Solution {
public:
    int pathSum(TreeNode* root, int targetSum) {
        unordered_map<long long, int> cnt;
        cnt[0] = 1;
        int ans = 0;

        auto dfs = [&](auto&& self, TreeNode* node, long long sum) -> void {
            if (!node) return;

            sum += node->val;
            ans += cnt[sum - targetSum];

            cnt[sum]++;
            self(self, node->left, sum);
            self(self, node->right, sum);
            cnt[sum]--;
        };

        dfs(dfs, root, 0);
        return ans;
    }
};
```

#### [二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)

-用后序遍历=>因为找最近公共祖先，必须：
先把左右子树都查完
才能判断当前节点是不是答案

```cpp
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if(!root) return NULL;
        if(root==p||root==q) return root;
        TreeNode* l=lowestCommonAncestor(root->left,p,q);
        TreeNode* r=lowestCommonAncestor(root->right,p,q);
        if(l&&r){
            return root;
        }
        else if(l&&!r){
            return l;
        }
        else if(r&&!l){
            return r;
        }
        return NULL;
    }
};
```

#### [二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/description/)

```cpp
class Solution {
public:
    int maxPathSum(TreeNode* root) {
    long long ans=-1e18;

    auto dfs=[&](auto&& self,TreeNode* root)->int {
        if(!root) return 0;

        int l=self(self,root->left);
        int r=self(self,root->right);

        l=max(0,l);
        r=max(0,r);

        ans=max(ans,(long long)root->val+l+r);

        return root->val+max(l,r);
    };

    dfs(dfs,root);

    return ans;
    }
};
```

### 图论

#### [岛屿数量](https://leetcode.cn/problems/number-of-islands/description/)

```cpp
class Solution {
public:
    int dx[4]={0,0,1,-1};
    int dy[4]={1,-1,0,0};

    int numIslands(vector<vector<char>>& grid) {
        int n=grid.size(),m=grid[0].size();

        auto dfs=[&](auto&& self,int x,int y)->void{

            if(x<0||x>=n||y<0||y>=m||grid[x][y]!='1'){
                return;
            }

            grid[x][y]='2';
            for(int i=0;i<4;i++){
                int nx=dx[i]+x;
                int ny=dy[i]+y;
                self(self,nx,ny);
            }
        };

        int ans=0;
        for(int i=0;i<n;i++){
            for(int j=0;j<m;j++){
                if(grid[i][j]=='1'){
                    dfs(dfs,i,j);
                    ans++;
                }
            }
        }
        return ans;
    }
};
```

#### [腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/description/)

```cpp
class Solution {
    int dx[4]={0,0,1,-1};
    int dy[4]={1,-1,0,0};
public:
    int orangesRotting(vector<vector<int>>& grid) {
        int m=grid.size(),n=grid[0].size();
        int fresh=0;
        queue<pair<int,int>> q;

        for(int i=0;i<m;i++){
            for(int j=0;j<n;j++){
                if(grid[i][j]==1) fresh++;
                else if(grid[i][j]==2) q.push({i,j});
            }
        }

        int ans=0;
        while(fresh && !q.empty()){
            int size = q.size();

            for(int i=0;i<size;i++){
                auto [x,y] = q.front();
                q.pop();

                for(int k=0;k<4;k++){
                    int nx = x+dx[k];
                    int ny = y+dy[k];

                    if(nx>=0&&nx<m&&ny>=0&&ny<n&&grid[nx][ny]==1){
                        fresh--;
                        grid[nx][ny]=2;
                        q.push({nx,ny});
                    }
                }
            }
            ans++;
        }

        return fresh ? -1 : ans;
    }
};
```

#### [课程表](https://leetcode.cn/problems/course-schedule/description/)

- DFS 三色标记法

```cpp
class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> g(numCourses);
        for(auto& p:prerequisites){
            g[p[1]].push_back(p[0]);
        }

        vector<int>vis(numCourses);
        auto dfs=[&](auto&& self,int x)->bool{
            vis[x]=1;

            for(int y:g[x]){
                if(vis[y]==1||vis[y]==0&&self(self,y)) return true;
            }

            vis[x]=2;
            return false;
        };

       for(int i=0;i<numCourses;i++){
            if((vis[i]==0)&&dfs(dfs,i)) return false;
       }
       return true;
    }
};
```

#### [实现 Trie (前缀树)](https://leetcode.cn/problems/implement-trie-prefix-tree/description/)

`1. **Trie = 多叉树 + 字符索引 + 结束标记** 2. **insert**：建路径 + 标记结尾 3. **search**：走完全路径 + 必须是结尾 4. **startsWith**：只需要能走完全路径

```cpp
class Trie {
private:
    bool isEnd;
    Trie* next[26];
public:
    Trie() {
        isEnd = false;
        memset(next,0,sizeof(next));
    }

    void insert(string word) {
        Trie* node=this;
        for(char c: word){
            if(node->next[c-'a']==NULL){
                node->next[c-'a']=new Trie();
            }
            node=node->next[c-'a'];
        }
        node->isEnd=true;
    }

    bool search(string word) {
        Trie* node=this;
        for(char c:word){
            node = node->next[c-'a'];
            if(node ==  NULL){
                return false;
            }
        }
        return node->isEnd;
    }

    bool startsWith(string prefix) {
        Trie* node = this;
        for(char c:prefix){
            node = node->next[c-'a'];
            if(node ==  NULL){
                return false;
            }
        }
        return true;
    }
};

/**
 * Your Trie object will be instantiated and called as such:
 * Trie* obj = new Trie();
 * obj->insert(word);
 * bool param_2 = obj->search(word);
 * bool param_3 = obj->startsWith(prefix);
 */
```
