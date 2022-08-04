#include <iostream> 
#include <vector> 
#include <algorithm> 
using namespace std; 
int main() { 
    int n, a, b; 
    cin >> n >> a >> b; 
    vector<vector<int>> dp(a + 1, vector<int>(b + 1, 0)); 
    int profitA, profitB; 
    for (int i = 1; i <= n; i++) { 
        cin >> profitA >> profitB; 
        for (int j = min(a, i); j >= max(0, a - n + i); j--) { 
            for (int k = min(b, i - j); k >= max(0, a + b - n + i - j); k--) { 
                if (j == 0 && k == 0) continue; //if (j + k > i) break; 
                if (k == 0) { 
                    //将第i辆车不派出或者派到A地 
                    dp[j][k] = max(dp[j][k], dp[j - 1][k] + profitA); 
                } else if (j == 0) { 
                    //将第i辆车不派出或者派到B地 
                    dp[j][k] = max(dp[j][k], dp[j][k - 1] + profitB); 
                } else { 
                    //将第i辆车不派出或者派到A地或者派到B地 
                    dp[j][k] = max(dp[j][k],max(dp[j - 1][k] + profitA, dp[j][k - 1] + profitB)); 
                } 
            } 
        } 
    } 
    cout << dp[a][b] << endl; 
    return 0; 
}
