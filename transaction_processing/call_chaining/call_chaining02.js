function add(number) {
    let count = number;
    let _b = function(l) {
        count += l;
        return _b;
    }

    _b.valueOf = function () {
        return count;
    }

    _b.toString = function() {
        return `${count}`
    }

    return _b;
}

let c = add(1)(2)(3);

console.log(c.toString(), +c);
