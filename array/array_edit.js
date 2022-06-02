const a = [1, 2, 3, 4, 5, 7, 9]
const b = [2, 4, 6, 8, 10]
//数组交集
/**
 * @method intersection
 * @param {[]} source 
 * @param {[]} target 
 */
const intersection = (source, target) => {
    let returnData = source.filter(v => target.includes(v));

    return returnData;
}
//数组并集
/**
 * @method union
 * @param {[]} source 
 * @param {[]} target 
 */
const union = (source, target) => {
    let returnData = source.concat(target.filter(v => !source.includes(v)))

    return returnData;
}

//数组差集
/**
 * @method difference
 * @param {[]} source 
 * @param {[]} target 
 */
const difference = (source, target) => {
    let returnData = source.filter(v => !target.includes(v))

    return returnData   
}

//判断是否是数组对象
const isArray = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

difference(a, b)