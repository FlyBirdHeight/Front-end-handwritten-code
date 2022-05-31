const apply = function(context, props){
    if (Array.isArray(props)) {
        throw new Error("props should be Array")
    }

    return this.call(context, ...props);
}

const bind = function(context, props){
    if (Array.isArray(props)) {
        throw new Error("props should be Array")
    }
    let _this = this;
    return function () {
        return _this.apply(context, props)
    }
}

const call = function(context, ...props){
    if (typeof (context) != 'object') {
        throw new Error("context is not object")
    }
    let key = Symbol('key');
    context[key] = this;
    let returnData = context[key](...props);
    Reflect.deleteProperty(context, key);
    return returnData;
}