const arr = [1, 2, 3, 4, 5, 6]
//数组求和
/**
 * @method sum
 * @param {[]} data 
 */
const sum = (data) => {
    let total = data.reduce((preValue, currentValue) => {
        return preValue + currentValue
    }, 0)

    return total;
}

//最大值
const max = (data) => {
    return data.reduce((pre, cur) => pre > cur ? pre : cur, 0)
}

//数组转对象
const data = [{ id: 1, name: "adsionli" }, { id: 2, name: "shirley" }];
const AtoO = () => {
    return data.reduce((pre, cur) => {
        pre[cur.id] = cur;
        return pre;
    }, {})
}

//二维数组转为一维数组
const data2 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
const flat = () => {
    return data2.reduce((pre, cur) => {
        pre.push(...cur)
        return pre;
    }, [])
}

//数组去重
const data3 = [1, 1, 1, 2, 3, 4, 7, 89, 4, 5, 6, 7, 8, 9];
const filter = () => {
    return data3.reduce((pre, cur) => {
        !pre.includes(cur) && pre.push(cur);
        return pre;
    }, [])
}
//求字符串中每个字母的出现次数
const str = 'sfhjasfjgfasjuwqrqadqeiqsajsdaiwqdaklldflas-cmxzmnha';
const calculateCount = () => {
    return str.split("").reduce((pre, next) => {
        pre[next] ? pre[next]++ : pre[next] = 1
        return pre;
    }, {});
}


console.log(calculateCount());
