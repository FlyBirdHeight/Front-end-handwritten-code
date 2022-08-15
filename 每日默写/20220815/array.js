//数组，数组扁平化等
const forEach = function (callback, context) {
    let self = this, i = 0, len = self.length;

    for (; i < len; i++) {
        typeof callback == 'function' && callback.call(context, self[i], i)
    }
}

const filter = function (callback, context) {
    let self = this, i = 0, len = self.length;
    let res = [];
    for (; i < len; i++) {
        if (callback.call(context, [self[i], i, self])) {
            res.push(self[i])
        }
    }

    return res;
}

const find = function (cb) {
    for (let i = 0; i < this.length; i++) {
        if (cb(this[i], i)) {
            return this[i]
        }
    }
}

const findIndex = function (cb) {
    for (let i = 0; i < this.length; i++) {
        if (cb(this[i], i)) {
            return i
        }
    }

    return -1;
}

const map = function (cb, context) {
    let self = this, len = this.length;
    let res = [];
    for (let i = 0; i < len; i++) {
        res.push(cb.call(context, self[i], i, self));
    }

    return res;
}
//重要，需要记住，Array.reduce方法
const reduce = function (fn, initialValue) {
    let arr = Array.prototype.slice.call(this);
    let res, startIndex;

    res = initialValue ? initialValue : arr[0];
    startIndex = initialValue ? 0 : 1;

    for (let i = startIndex; i < arr.length; i++) {
        res = fn.call(null, res, arr[i], i, this)
    }
    return res;
}
//NOTE: 判断数组是否符合传入cb的要求
const every = function (fn, context) {
    let self = this, len = this.length;
    for (let i = 0; i < len; i++) {
        if (!fn.call(context, self[i], i, self)) {
            return false;
        }
    }

    return true;
}

//数组扁平化写法
const first = (arr) => {
    return arr.flat(Infinity);
}
const second = (arr) => {
    let result = [];
    let fn = function (arr) {
        for (let i = 0; i < ary.length; i++) {
            let item = arr[i];
            if (Array.isArray(arr[i])) {
                fn(item);
            } else {
                result.push(item);
            }
        }
    }
    fn(arr);
    return result;
}
function third(ary) {
    return ary.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
    }, []);
}
function forth(arr) {
    if (!arr.length) return;
    while (arr.some((item) => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}
//NOTE: 判断是否是数组
const isArray = function (a) {
    return Object.prototype.toString.call(Object(a)) === '[object Array]'
}
//NOTE: 数组去重
function distinct1(arr) {
    for (let i = 0, len = arr.length; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
            if (arr[i] == arr[j]) {
                arr.splice(j, 1);
                // splice 会改变数组长度，所以要将数组长度 len 和下标 j 减一
                len--;
                j--;
            }
        }
    }
    return arr;
}
function distinct2(a, b) {
    let arr = a.concat(b);
    return arr.filter((item, index) => {
        //return arr.indexOf(item) === index
        return arr.includes(item)
    })
}
function distinct3(array) {
    return Array.from(new Set(array));
}
