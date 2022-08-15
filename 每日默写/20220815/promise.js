//Promise原型链方法，promise本身实现

class Promise {
    constructor(fn) {
        this.fn = fn;
        this.status = 'Pending';
        this.callbacks = [];
        this.value = null;
        this.reason = null;
        try {
            fn(this._resolve.bind(this), this._reject.bind(this));
        } catch (error) {
            this.reject(error)
        }
    }

    then(onFulfilled, onRejected = null) {
        return new Promise((resolve, reject) => {
            this.handle({
                onFulfilled,
                onRejected,
                resolve,
                reject
            })
        })
    }

    catch(onRejected) {
        this.then(null, onRejected)
    }

    handle(callback) {
        if (this.status === 'Pending') {
            this.callback.push(callback);
            return;
        }
        let cb = this.status === 'Fulfilled' ? callback.onFulfilled : callback.onRejected;
        let rcb = this.status === 'Fulfilled' ? callback.resolve : callback.reject;
        let value = this.status === 'Fulfilled' ? this.value : this.reason;
        if (!cb) {
            rcb(value);
            return;
        }
        let data = cb(value);
        rcb(data);
    }

    _resolve(value) {
        if (this.status === 'Pending') {
            if (value && (typeof value === 'object' && typeof value.then === 'function') && value instanceof Promise) {
                let then = value.then;
                then.call(value, this._resolve.bind(this), this._reject.bind(this));
                return;
            }
            this.status = 'Fulfilled';
            this.value = value;
            this.callbacks.forEach(fn => this.handle(fn(value)))
        }
    }

    _reject(value) {
        if (this.status === 'Pending') {
            this.status = 'Rejected';
            this.reason = value;
            this.callbacks.forEach(fn => this.handle(fn(value)));
        }

    }
}