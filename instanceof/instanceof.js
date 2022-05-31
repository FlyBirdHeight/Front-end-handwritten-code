const copyInstanceof = function (example, classFunc) {
    let proto = Reflect.getPrototypeOf(example);
    while (true) {
        if (!proto) return false;

        if (proto === classFunc) return true;

        proto = Reflect.getPrototypeOf(proto);
    }
}

class Person {
    constructor() {
        this.name = "adsionli"
    }
}

class Male extends Person {
    constructor() {
        super();
        this.sex = "male"
    }
}

console.log(copyInstanceof(Male, Array));
