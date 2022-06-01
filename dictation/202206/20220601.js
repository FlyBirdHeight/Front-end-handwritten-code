//README: 第一部分: debounce throttle
//1. debounce
const debounce = (cb, time) => {
    let timer;
    return function (...arg) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            cb.call(this, ...arg);
        }, time)
    }
}
//2. throttle 第一次立即执行，时间戳计算
const throttle01 = (cb, time) => {
    let start = 0;
    return function (...arg) {
        let now = +new Date();
        if (now - start > time) {
            cb.apply(this, arg);
            start = now;
        }
    }
}
//3. throttle 最后一次必定执行，计时器形式
const throttle02 = (cb, time) => {
    let timer = null;
    return function (...arg) {
        if (!timer) {
            timer = setTimeout(() => {
                cb.apply(this, arg);
                timer = null;
            }, time)
        }
    }
}
//4. 根据3改写，第一次立即执行
const throttle03 = (cb, time) => {
    let timer = null;
    return function (...arg) {
        cb.apply(this, arg);
        if (!timer) {
            timer = setTimeout(() => {
                cb.apply(this, arg);
                timer = null;
            }, time)
        }
    }
}
//5. 第一次立即执行，中间节流，最后一次立即执行
const throttle = (cb, time) => {
    let timer = null;
    let start = 0;
    return function (...arg) {
        let now = +new Date();
        if (now - start < time) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                cb.apply(this, arg);
                start = now;
            }, time)
        } else {
            start = now;
            cb.apply(this, arg);
        }
    }
}

//README: 第二部分：instanceof
const editInstanceof = (example, target) => {
    let prop = Reflect.getPrototypeOf(example);
    while (true) {
        if (!prop) return false;
        if (prop === target) {
            return true;
        }
        prop = Reflect.getPrototypeOf(prop);
    }
}


//README: 第三部分：new 
const editNew = (fn, ...arg) => {
    let instance = fn.prototype;
    let res = fn.call(instance, ...arg);
    return typeof res === 'object' ? res : instance;
}

//README: 第四部分：extends
//组合继承
const Parent = function (val) {
    this.value = val;
}

Parent.prototype.getValue = function () {
    console.log(this.value);
}
const Child = function (val) {
    Parent.call(null, val);
}
Child.prototype = new Parent()
//寄生组合继承
const Parent = function (val) {
    this.value = val;
}

Parent.prototype.getValue = function () {
    console.log(this.value);
}
const Child = function (val) {
    Parent.call(null, val);
}
Child.prototype = Object.create(Parent.prototype);