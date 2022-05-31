//NOTE: https://adsionli.xslease.com/page/js/throttle-debounce 解释看这里

const debounce = (fn, time) => {
    let timer = null;
    return function (...args) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.call(this, ...args)
        }, time)
    }
}
//最后一次立即执行
const throttle01 = (fn, time) => {
    let timer = null;
    return function (...args) {
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, time);
                timer = null;
            }, time)
        }
    }
}
//第一次立即执行
const throttle02 = (fn, time) => {
    let start = 0;
    return function (...args) {
        let now = +new Date();
        if (now - start > time) {
            fn.apply(this, args);
            start = now;
        }
    }
}
//修改定时器版本，第一次立即执行
const throttle03 = (fn, time) => {
    let timer = null;
    return function (...args) {
        fn.call(this, ...args);
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, time);
                timer = null;
            }, time)
        }
    }
}

//第一次立即执行，中间使用节流，最后一次立即执行
const throttle04 = (fn, time) => {
    let start = 0;
    let timer = null;
    return function (...args) {
        let now = +new Date();
        if (now - start < timer) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                start = now;
                fn.apply(this, args);
            }, time)
        } else {
            start = now;
            fn.apply(this, args);
        }
    }
}