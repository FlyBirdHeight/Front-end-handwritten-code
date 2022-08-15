//节流防抖
const debounce = function (fn, time) {
    let timer = null;
    return function (...props) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.call(this, ...props)
        }, time);
    }
}

const throttle_start = function (fn, time) {
    let preTime = 0;
    return function (...args) {
        let now = +new Date();
        if (now - preTime >= time) {
            fn.call(this, ...args);
            preTime = now;
        }
    }
}

const throttle_end = function (fn, time) {
    let timer = null;
    return function (...args) {
        if (timer) {
            timer = setTimeout(() => {
                fn.call(this, ...args);
                timer = null;
            }, time)
        }
    }
}

const throttle_start_end = function (fn, time) {
    let time = null;
    let preTime = 0;
    return function (...args) {
        let now = +new Date();
        if(now - preTime < time) {
            if(timer) clearTimeout(timer);
            timer = setTimeout(() => {
                preTime = now;
                fn.call(this, ...args)
            }, time)
        }else {
            preTime = now;
            fn.call(this, ...args);
        }
    }
}