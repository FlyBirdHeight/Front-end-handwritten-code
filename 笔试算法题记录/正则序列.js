let n = Number(readline());
let arr = readline().split(" ").map(v => Number(v));
arr.sort((a, b) => a - b);
let res = 0;
for(let i = 1; i <= arr.length; i++) {
    res += Math.abs(i - arr[i - 1]);
}
console.log(res);