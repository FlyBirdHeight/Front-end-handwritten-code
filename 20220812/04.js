let data = [7, 3, 1, 4];
let sum = 0;
data.forEach(v => {
    sum += v;
})
let dp = new Array(sum + 1).fill(0);
dp[0] = 1;
for (let i = 0; i < data.length; i++) {
    for (let j = sum; j >= data[i]; j--) {
        dp[j] = dp[j] || dp[j - data[i]]
    }
}
for (let i = sum; i >= 0; i--) {
    if (dp[i] && i % 7 == 0) {
        console.log(i);
        break;
    }
}