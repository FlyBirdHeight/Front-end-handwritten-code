//事务调度
const callChaining = function () {
    this.tasks = [];

    this.task = function (time, cb) {
        this.tasks.push({ time, cb });
        return this;
    }

    this.start = function () {
        while (this.tasks.length) {
            let { time, cb } = this.tasks.shift();

            setTimeout(cb, time)
        }
    }
}