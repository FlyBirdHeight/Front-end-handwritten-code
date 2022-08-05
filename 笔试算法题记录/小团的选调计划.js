let count = 5;
let data = [
    [1, 5, 3, 4, 2],
    [2, 3, 5, 4, 1],
    [5, 4, 1, 2, 3],
    [1, 2, 5, 4, 3],
    [1, 4, 5, 2, 3],
]

let pos = new Array(count + 1).fill(0);
let res = [];
for(let value of data) {
    let p1 = value[0];
    if(!pos[p1]) {
        res.push(p1);
        pos[p1] = true;
    }else {
        for(let i = 1; i < value.length; i++) {
            if(!pos[value[i]]) {
                res.push(value[i])
                pos[value[i]] = true;
                break;
            }
        }
    }
}

console.log(res)