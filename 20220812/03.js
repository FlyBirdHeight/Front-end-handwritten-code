let str = "abbcbb";
let len = str.length;
const centerCal = (start, end) => {
    let count = 0;
    while (start >= 0 && end < len && str[start] == str[end]) {
        if(start != end) {
            count++;
        }
        start--;
        end++;
    }
    return count;
}
let res = 0;
for(let i = 0; i < len; i++) {
    res += centerCal(i, i);
    res += centerCal(i, i+1);
}

console.log(res)