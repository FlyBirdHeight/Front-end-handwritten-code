//对象相关
const newObj = function (fn, ...args) {
    let context = Object.create(Object.getPrototypeOf(fn));
    let res = fn.apply(context, args);

    return typeof res === 'object' ? res : context
}

const instanceOf = function (example, classFunc) {
    let proto = Reflect.getPrototypeOf(example);
    while (true) {
        if (!proto) return false;
        if (proto === classFunc) {
            return true;
        }
        proto = Reflect.getPrototypeOf(proto);
    }
}