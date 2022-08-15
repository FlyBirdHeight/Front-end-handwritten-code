let pos = "1 0 1 0 1".split(" ");
let arr = [];
let end = 0, startCount = 0, isStart = false;
let first = false, count = 0, start = 0;
for (let i = 0; i < pos.length; i++) {
    if(i == 0 && Number(pos[i]) === 0) {
        isStart = true;
    }
    if (Number(pos[i]) === 0 && !first) {
        first = true;
        start = i;
    } else if (Number(pos[i]) === 0 && first) {
        continue;
    } else if (Number(pos[i]) === 1 && first) {
        first = false;
        arr.push([start, i]);
        start = 0;
        if(isStart) {
            startCount = i - 0 + 1;
        }
    }
}
if (first) {
    arr.push([start, pos.length]);
    end = pos.length - start;
}
arr.sort((a, b) => {
    return (b[1] - b[0]) - (a[1] - a[0])
})
let maxL = arr[0];
if (maxL[0] === 0 || maxL[1] === pos.length) {
    console.log(maxL[1] - maxL[0])
} else {
    let res = Math.ceil((maxL[1] - maxL[0]) / 2);
    console.log(res > end ? res : end > startCount ? end : startCount);
}