var findTheLongestSubstring = (str) => {
    let res = 0 
    let state = 0 // 前缀区间的state状态
    let vowel = { a: 1, e: 2, i: 4, o: 8, u: 16 } // 对照表
    let map = { 0: -1 } // map存放各个前缀区间的state
    for (let i = 0; i < str.length; i++) { // 遍历str串
        let char = str[i] // 获取当前遍历的字符
        if (vowel[char] !== undefined) { // 当前遍历的字符是元音
            state ^= vowel[char] // 求出当前前缀区间的state
            if (map[state] === undefined) {
                map[state] = i
            }
        }
        let distance = i - map[state]
        res = Math.max(res, distance)
    }
    return res
}