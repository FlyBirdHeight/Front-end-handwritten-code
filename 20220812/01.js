let [count, line] = [10, 9];
let list = [
    "1 left 2",
    "1 right 3",
    "2 left 4",
    "2 right 5",
    "3 right 6",
    "6 left 7",
    "6 right 8",
    "8 left 9",
    "8 right 10"
];
let map = new Map();
map.set(1, []);
for (let i = 0; i < list.length; i++) {
    let [parent, pos, child] = list[i].split(" ");
    if (map.has(Number(parent))) {
        let data = map.get(Number(parent));
        data.push(Number(child))
        map.set(Number(parent), data);
    } else {
        map.set(Number(parent), [Number(child)]);
    }
}
let res = 0;
for(let [key, value] of map) {
    if(value.length < 2) {
        continue
    }
    let [node1, node2] = value;
    if(!map.has(node1) && !map.has(node2)) {
        res++;
    }
}

console.log(res)