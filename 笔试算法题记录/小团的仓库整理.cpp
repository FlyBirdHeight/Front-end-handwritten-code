#include <bits/stdc++.h>

using namespace std;

vector<int> fa, sz;

int res = 0;

int find(int x){
    return x == fa[x] ? x : find(fa[x]);
}

void unite(int x, int y){
    x = find(x);
    y = find(y);
    if(x == y)
        return;
    fa[y] = x;
    sz[x] += sz[y];         // 合并货物重量
    res = max(res, sz[x]);  // 更新最大重量
}

int main(int argc, char* argv[]){

//    freopen("../input.txt", "r", stdin);

    int n;
    cin >> n;
    vector<int> nums(n);

    for(int i = 0; i < n; ++i)
        cin >> nums[i];

    fa.resize(n);
    sz.resize(n);
    for(int i = 0; i < n; ++i){
        fa[i] = i;
        sz[i] = nums[i];  
    }

    vector<int> indexes(n);
    for(int i = 0; i < n; ++i){
        cin >> indexes[i];
        --indexes[i];
    }
    vector<bool> tmp(n, false);
    vector<int> vec(n);
    for(int i = n-1; i >= 0; --i){
        vec[i] = res;
        int j = indexes[i];
        res = max(res, nums[j]);      // 更新最大重量
        if(j + 1 < n && tmp[j + 1]){  
            unite(j, j + 1);          //将右侧货物重量合并到当前放的这个货物上
        }
        if(j > 0 && tmp[j - 1]){    
            unite(j - 1, j);          //将当前货物重量合并到左侧货物上
        }
        tmp[j] = true;
    }

    for(int x : vec)
        cout << x << endl;

    return 0;
}