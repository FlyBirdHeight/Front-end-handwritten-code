//组合继承，寄生组合继承
const Parent = function (value) {
    this.value = value;
}

Parent.prototype.getValue = function() {
    console.log(getValue)
}

const Child = function(value) {
    Parent.call(this, value)
}

Child.prototype = new Parent();


const Parent2 = function(value) {
    this.value = value;
}
Parent2.prototype.getValue = function() {
    console.log(getValue)
}
const Child2 = function(value) {
    Parent.call(this, value)
}
Child2.prototype = Object.create(Parent.prototype);