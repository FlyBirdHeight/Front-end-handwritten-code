class LimitPromise {
    constructor(maxC) {
        this.max = maxC;
        this.count = 0;
        this.taskQueue = [];
    }

    _createTask(caller, args, resolve, reject) {
        return () => {
            caller(args)
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    this.count--;
                    if (this.taskQueue.length) {
                        let task = this.taskQueue.shift();
                        task();
                    }
                })

            this.count++;
        }
    }

    call(caller, args) {
        return new Promise((resolve, reject) => {
            const task = this._createTask(caller, args, resolve, reject);

            if (this.count >= this.max) {
                this.taskQueue.push(task)
            } else {
                task();
            }
        })
    }
}



Promise.all = function (tasks, maxC) {
    let count = 0;
    let taskQueue = [];

    return new Promise((resolve, reject) => {
        let len = tasks.length;
        let fullfillCount = 0;
        let returnData = new Array(len);
        const createTask = (task, index, resolve, reject) => {
            return () => {
                task.then(res => {
                    fullfillCount++;
                    count--;
                    returnData[index] = res;
                    if (fullfillCount === len) {
                        resolve(returnData);
                    }
                    if(taskQueue.length) {
                        let task = taskQueue.shift();
                        task();
                    }
                }).catch(reject)

                count++;
            }
        }
        if (len === 0) {
            resolve(returnData);
            return;
        }

        tasks.forEach((promise, index) => {
            let task = createTask(promise, index, resolve, reject);
            if(count >= maxC) {
                taskQueue.push(task)
            }else {
                task();
            }
        });
    })
}