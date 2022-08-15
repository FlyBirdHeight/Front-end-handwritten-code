//连加
function add(number) {
    let sum = number;
    let _b = function (l) {
        sum += l;
        return _b
    }
    _b.valueOf = function () {
        return sum
    }
    _b.toString = function () {
        return `${sum}`
    }

    return _b;
}

let c = add(1)(2)(3)
console.log(+c, c.toString())