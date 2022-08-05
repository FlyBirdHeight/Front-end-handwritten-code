let [n, x, y] = [6, 2, 3];
let arr = [1, 2, 3, 3, 4, 5];
let res = -1;
arr.sort((a, b) => a - b);
for (let i = x; i <= y; i++) {
    let good = n - i;
    let err = i;
    if(err >= x && good <= y && arr[i - 1] != arr[i]) {
        res = arr[i - 1];
        break;
    } 
}

console.log(res)