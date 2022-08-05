let len = 10;
let str = "MMATSATMMT";
let pre = "", next = "";
let pre = 0, next = str.length - 1;
for(; pre < str.length; pre++) {
    if(str[pre] === 'M') {
        pre++
        break;
    }
}
for(; next >=0; next--) {
    if(str[next] === 'T'){
        next--;
        break;
    }
}
while(!(str[pre] === 'T' && str[next] === 'M')) {
    if(str[pre] !== 'T') pre++;
    if(str[next] !== 'M') next--;
}
console.log(str.substring(pre + 1, next))