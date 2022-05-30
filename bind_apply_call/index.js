const apply = function (obj, props) {
    if (!Array.isArray(props)) {
        throw new Error('arguments should be Array!')
    }

    return this.call(obj, ...props)
}

const bind = function (obj, props) {
    if (!Array.isArray(props)) {
        throw new Error('arguments should be Array!')
    }
    let fn = this;
    return function () {
        fn.apply(obj, props);
    }
}

const call = function (obj, ...props) {
    //NOTE: 传统方法的使用，直接挂载在传入的对象下面，这里就可以利用Symbol的特性，唯一性，然后就不会与原对象内容具有相同类型名称了
    let key = Symbol('key');
    obj[key] = this;
    let result = obj[key](...props);
    Reflect.deleteProperty(obj, key)
    return result;
}


const fn = function (...props) {
    console.log(this.name, this.age)
    console.log(...props);
}
fn.apply = apply;
fn.bind = bind;
fn.call = call;

const Obj = {
    name: "adsionli",
    age: "26"
}

let aO = fn.apply({
    name: "adsionli",
    age: "26"
}, ['a', 'apply'])

let bO = fn.bind(Obj, ['a', 'bind'])
bO()


let cO = fn.call(Obj, 'a', 'call')