const callChaining = function () {
    this.taskStack = [];

    this.task = function (time, cb) {
        this.taskStack.push({ time, cb });

        return this;
    }

    this.start = () => {
        while (this.taskStack.length > 0) {
            let { time, cb } = this.taskStack.shift();

            setTimeout(cb, time);
        }
    }
}

let task = new callChaining();
task.task(1000, () => {
    console.log(1)
}).task(3000, () => {
    console.log(3)
}).task(4000, () => {
    console.log(4)
}).start();