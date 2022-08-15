//apply,call,bind实现
const call = function (obj, ...props) {
    let fn = this;
    let key = Symbol('key');
    obj[key] = fn;
    let result = obj[key](...props);
    Reflect.deleteProperty(obj, key);

    return result
}

const apply = function (obj, props) {
    if (!Array.isArray(props)) {
        throw new Error("props is not array")
    }

    return call(obj, ...props)
}

const bind = function (obj, props) {
    if (!Array.isArray(props)) {
        throw new Error("props is not array")
    }
    let fn = this;
    return function () {
        return fn.apply(obj, props);
    }
}