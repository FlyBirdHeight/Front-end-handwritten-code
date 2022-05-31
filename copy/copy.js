//再深拷贝中，一定要注意的一点就是不能自己调用自身的处理，因为这样会导致栈溢出，会一直调用自身，所以需要去判断是否已经被调用过了。
//深拷贝还需要注意的就是拷贝对象的类型，有些对象是可迭代的，而有些是不可迭代的，处理方式是不同的，所以需要注意
const iterateObj = {
    '[object Map]': true,
    '[object Set]': true,
    '[object Arguments]': true,
    '[object Object]': true,
    '[object Array]': true
}

/**
 * @method handleFunctionCopy 处理函数对象的深拷贝
 * 虽然函数也是对象，但是它过于特殊，我们单独把它拿出来拆解。
提到函数，在JS种有两种函数，一种是普通函数，另一种是箭头函数。每个普通函数都是
Function的实例，而箭头函数不是任何类的实例，每次调用都是不一样的引用。那我们只需要
处理普通函数的情况，箭头函数直接返回它本身就好了。
 * @param {*} target 
 */
const handleFunctionCopy = (target) => {
    if (!target.prototype) {
        return target;
    }

    const argument = RegExp(/(?<=\().*(?=\)\s+{)/);
    const body = RegExp(/(?<={)(.|\n)+(?=})/, 'm');
    let fnBody = body.exec(target);
    if (!fnBody) return null;
    let param = argument.exec(target);
    if (param) {
        return new Function(...(param[0].split(',')), fnBody[0])
    } else {
        return new Function(fnBody[0])
    }

}

const handleNonIterate = (target, tag) => {
    //先获取原始的构造方法
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

/**
 * @method deepCopy 深拷贝的实现
 * @param {*} target 深拷贝对象
 * @param {WeakMap} map 保存对象，避免循环处理，陷入栈溢出情况
 */
const deepCopy = (target, map = new WeakMap()) => {
    //NOTE: 如果target类型不是对象，那肯定是基本类型，直接返回就是深拷贝了
    if ((typeof (target) != 'object' || typeof (target) != 'function') && !target) {
        return target;
    }

    if (map.has(target)) {
        return target;
    }
    let type = Object.prototype.toString.call(target);
    let cloneTarget;
    if (!Reflect.has(iterateObj, type)) {
        cloneTarget = handleNonIterate(target, type);
        return cloneTarget;
    } else {
        //NOTE: 为了保证其原型对象不会产生问题，保证原型对象依然作用在深拷贝对象上
        let Ctor = target.constructor;
        cloneTarget = new Ctor()
    }

    map.set(target, true);

    if (type === '[object Map]') {
        target.forEach((item, key) => {
            cloneTarget.set(typeof (key) === 'object' ? deepCopy(key, map) : key, deepCopy(item, map))
        })
        return cloneTarget
    }

    if (type === '[object Set]') {
        target.forEach((item) => {
            cloneTarget.add(deepCopy(item, map));
        })

        return cloneTarget;
    }

    for (let prop in target) {
        if (Reflect.has(target, prop)) {
            cloneTarget[prop] = deepCopy(target[prop], map);
        }
    }

    return cloneTarget;
}
const obj = {
    name: "adsionli",
    age: 26,
    birthday: new Date("1996-03-11"),
    getName() {
        return this.name
    },
    setName(name) {
        this.name = name
    }
}

let dp01 = deepCopy(obj)
console.log(dp01 === obj);

let dp02 = deepCopy(['1', '2', '3', obj])
console.log(dp02[3] === obj);
