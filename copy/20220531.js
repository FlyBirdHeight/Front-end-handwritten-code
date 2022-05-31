const iterableObj = {
    '[object Map]': true,
    '[object Set]': true,
    '[object Array]': true,
    '[object Arguments]': true,
    '[object Object]': true
}
const isIterable = obj => obj != null && typeof obj[Symbol.iterator] === 'function';

const handleFunctionCopy = (target) => {
    if (!target.prototype) {
        return target;
    }

    const argument = RegExp(/(?<=\().*(?=\)\s+{)/);
    const body = RegExp(/(?<={)(.|\n)+(?=})/, 'm');
    let fnBody = body.exec(target);
    if (!fnBody) return null;
    let param = argument.exec(target);
    //NOTE: 判断有参数还是无参数
    if (param) {
        return new Function(...(param[0].split(',')), fnBody[0])
    } else {
        return new Function(fnBody[0])
    }
}

const handleNoIterableObj = (target, tag) => {
    const Ctor = target.constructor;
    switch (tag) {
        case '[object Function]':
            return handleFunctionCopy(target);
        case '[object RegExp]':
            const { source, flags } = target;
            return new Ctor(source, flags);
        case '[object Boolean]':
            return new Object(Boolean.prototype.valueOf.call(target));
        case '[object Number]':
            return new Object(Number.prototype.valueOf.call(target));
        case '[object String]':
            return new Object(String.prototype.valueOf.call(target));
        case '[object Symbol]':
            return new Object(Symbol.prototype.valueOf.call(target));
        case '[object Error]':
        case '[object Date]':
        default:
            return new Ctor(target);
    }
}

const deepCopy = (target, map = new WeakMap()) => {
    if (typeof (target) != 'object') {
        return target;
    }
    if (map.has(target)) {
        return;
    }
    let type = Object.prototype.toString.call(target);
    let cloneTarget;
    if (!Reflect.has(iterableObj, type) || isIterable(target)) {
        return handleNoIterableObj(target, type);
    } else {
        let Ctor = target.constructor;
        cloneTarget = new Ctor();
    }

    map.set(cloneTarget, true);
    if (type === '[object Map]') {
        target.forEach((v, k) => {
            cloneTarget.set(typeof (key) === 'object' ? deepCopy(key, map) : key, deepCopy(item, map))
        })

        return target;
    }

    if (type === '[object Set]') {
        target.forEach(v => {
            cloneTarget.add(deepCopy(v));
        })

        return target;
    }

    for (let key in target) {
        if (Reflect.has(target, prop)) {
            cloneTarget[prop] = deepCopy(target[prop], map);
        }
    }

    return target;

}