let [n, m] = readline().split(" ").map(v => Number(v));
let resArr = [], idx = 0;
while(line = readline()) {
    let [v, w] = line.split(" ").map(v => Number(v));
    let val = v + w * 2;
    resArr.push({index:idx + 1,val})
    idx++;
}
resArr.sort((a,b)=> {
    if(b.val != a.val){
        return b.val - a.val
    }else {
        return a.index - b.index
    }
});
let res= [];
for(let i = 0; i < m; i++) {
    res.push(resArr[i].index);
}
res.sort((a,b)=> a-b);
console.log(res.join(" "))