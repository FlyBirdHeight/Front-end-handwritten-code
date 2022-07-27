let input = 23521;
let arr = [2, 3, 5];

const getData = () => {
    let str = String(input);
    arr = arr.sort((a, b) => a - b);
    let res = [];
    for (let i = 0; i < str.length; i++) {
        let number = +str[i];
        for (let j = 0; j < arr.length; j++) {
            if (arr[j] < number) {
                continue
            } else if (arr[j] >= number) {
                res.push(arr[j]);
                break;
            }
        }
    }

    return +res.join("");
}

console.log(getData());


let input1 = 23521;
let arr1 = [2, 3, 5];

const getData1 = () => {
    let str = String(input1);
    arr = arr.sort((a, b) => a - b);
    let res = [];
    for (let i = 0; i < str.length; i++) {
        let number = +str[i];
        let min = arr[0];
        for (let j = 1; j < arr.length; j++) {
            if (arr1[j] < number) {
                continue
            } else if (arr[j] >= number) {
                min = Math.min(min, arr[j]);
            }
        }
        if (min >= number) {
            res.push[min]
        }
    }

    return +res.join("");
}

console.log(getData1());
