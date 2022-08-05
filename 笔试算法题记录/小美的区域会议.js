let [n, k] = readline().split(" ").map(v => Number(v));
let res = n;
let data = new Array(n + 1).fill(0).map(v => {
    return {val: 0, next: 0}
});
let idx = 1;
while(line = readline()) {
    if(idx === n - 1) {
        let d = line.split(" ").map(v => Number(v));
        for(let i = 1; i <= n; i++) {
            data[i].val = d[i];
        }
        break;
    }
    let [s1, s2] = line.split(" ").map(v => Number(v));
    data[s1].next = s2;
    idx++;
}