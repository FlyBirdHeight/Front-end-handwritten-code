function normalizeClassValue(value) {
    let returnData = [];
    const type = Array.isArray(value) ? 'array' : typeof value;
    if (type === 'string') {
        return [value];
    } else if (type === 'array') {
        for (let key in value) {
            returnData = returnData.concat(normalizeClass(value[key]))
        }
    } else if (type === 'object') {
        for (let key in value) {
            if (typeof value[key] === 'object') {
                returnData = returnData.concat(normalizeClass(value[key]))
            } else {
                returnData.push(key)
            }
        }
    }

    return returnData;
}

