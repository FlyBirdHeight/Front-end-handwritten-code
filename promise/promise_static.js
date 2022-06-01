//Promise.resolve的实现,这里是静态方法的实现
//README: thenable 是指含有then，且接受的参数是resolve, reject
Promise.resolve = function (value) {
    //如果Resolve返回的是一个Promise对象，不用处理，直接返回
    if (value instanceof Promise) {
        return value;
    }

    return new Promise((resolve, reject) => {
        if (value && value.then && typeof value.then == 'function') {
            value.then(resolve, reject)
        } else {
            resolve(value);
        }
    })
}

//Promise.reject的实现,这里是静态方法的实现
Promise.reject = function (value) {
    return new Promise((resolve, reject) => {
        reject(value)
    })
}
//Promise.all
//README: 首先我们需要知道Promise.all是将全部Promise执行完毕后，统一返回一个数组，如果其中一个失败，就没有返回了
Promise.all = function (params) {
    if (typeof params[Symbol.iterator] !== 'function') {
        throw new Error('params is not have iterator function');
    }
    return new Promise((resolve, reject) => {
        let len = params.length;
        let fullfillCount = 0;
        let returnData = new Array(len);
        if (len === 0) {
            resolve(returnData);
            return;
        }

        params.forEach((promise, index) => {
            promise.then(res => {
                fullfillCount++;
                returnData[index] = res;
                if (fullfillCount === len) {
                    resolve(returnData);
                }
            }).catch(e => {
                reject(e);
            })
        });
    })
}
//Promise.finally
Promise.prototype.finally = function (cb) {
    if (typeof cb !== 'function') {
        return this.then()
    }
    let Promise = this.constructor;
    //无论最后的结果是什么，都会执行，所以我们主动调用then，如果成功就走成功的内容，并且返回成功的值，如果失败，就走error，并且执行，并throw error被外部catch
    return this.then(res => {
        Promise.resolve(cb()).then(_ => res);
    }, error => {
        return Promise.resolve(cb()).then(_ => { throw error })
    })
}
//Promise.race
Promise.race = function (params) {
    if (typeof params[Symbol.iterator] !== 'function') {
        throw new Error('params is not have iterator function');
    }

    return new Promise((resolve, reject) => {
        params.forEach(promise => {
            Promise.resolve(promise).then(res => {
                resolve(res);
                return;
            }).catch(e => {
                reject(e);
                return;
            })
        })
    })
}

//Promise.allsettled 这个静态函数可以获取全部传入的Promise的状态以及返回内容
Promise.allsettled = function (params) {
    return new Promise((resolve, reject) => {
        const addElementToResult = (index, data) => {
            resultData[index] = data;
            editCount++;
            if (resultData.length == editCount) {
                resolve(resultData)
            }
        }
        let index = 0;
        let editCount = 0;
        let resultData = new Array(index);
        for (const promise of params) {
            const currentIndex = index;
            promise.then(value => {
                addElementToResult(currentIndex, {
                    status: "fulfilled",
                    value
                })
            }, error => {
                addElementToResult(currentIndex, {
                    status: "rejected",
                    error
                })
            })
            index++;
        }
        if (index === 0) {
            resolve([]);
            return;
        }
    })
}