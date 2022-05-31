/**
 * NOTE: 首先需要明确，对象的构造方法的prototype在实例对象__proto__上，实例对象的__proto__就是原型对象
 * @param {*} fn 传入的是构造方法
 * @param  {...any} args 
 */
const newObj = (fn, ...args) => {
    //instance就是原型对象
    let instance = Object.create(fn.prototype);
    let res = fn.apply(instance, args);
    //需要判断res是否是一个对象，如果是对象的话就可以返回，如果不是对象的话，需要返回其prototype
    return typeof res === 'object' ? res : instance;
}