//发布订阅
class EventEmitter {
    constructor() {
        this._event = {};
    }
    /**
     * @method set 设置订阅
     */
    set(eventName, cb) {
        this._event[eventName] = [...(this._event[eventName] || []), cb];
    }

    off(eventName, cb) {
        if (!this._event[eventName]) {
            return;
        }
        this._event[eventName] = this._event[eventName].filter(fn => fn != cb && fn.l != cb);
    }

    emit(eventName, ...args) {
        if (!this._event[eventName]) {
            return;
        }
        this._event[eventName].forEach(fn => fn(...args));
    }

    once(eventName, cb) {
        const one = (...args) => {
            cb(...args);
            this.off(eventName, cb)
        }

        one.l = cb;
        this.on(eventName, one);
    }
}