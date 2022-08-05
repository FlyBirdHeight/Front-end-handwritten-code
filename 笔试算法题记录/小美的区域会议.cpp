#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
#define rep(i,a,b) for(int i = (a);i <= (b);++i)
#define re_(i,a,b) for(int i = (a);i < (b);++i)
#define dwn(i,a,b) for(int i = (a);i >= (b);--i)

const int N = 2e3 + 5;
const int mod = 1e9 + 7;

int n,k,a[N];vector<int> G[N];

void dbg(){puts("");}
template<typename T, typename... R>void dbg(const T &f, const R &... r) {
    cout << f << " ";
    dbg(r...);
}
template<typename Type>inline void read(Type &xx){
    Type f = 1;char ch;xx = 0;
    for(ch = getchar();ch < '0' || ch > '9';ch = getchar()) if(ch == '-') f = -1;
    for(;ch >= '0' && ch <= '9';ch = getchar()) xx = xx * 10 + ch - '0';
    xx *= f;
}

LL dfs(int u,int ufa,int rt){
    LL ans = 1;
    for(int v: G[u]){
        if(v == ufa) continue;
        if((a[v] == a[rt] && v < rt) || (a[rt] < a[v] && a[v] <= a[rt]+k)){
            (ans *= (1+dfs(v,u,rt))%mod) %= mod;
        }
    }
    return ans;
}

int main(int argc, char** argv) {
    read(n);read(k);
    re_(_,1,n){
        int p1,p2;read(p1);read(p2);
        G[p1].push_back(p2);
        G[p2].push_back(p1);
    }
    rep(i,1,n) read(a[i]);
    int ans = 0;
    rep(i,1,n) (ans += dfs(i,0,i)) %= mod;
    printf("%d\n",ans);
    return 0;
}