//组合继承
const Parent = function(value){
    this.value = value;
}
Parent.prototype.getValue = function() {
    console.log(this.value);
}
const Child = function(value){
    //这里其实相当于Super
    Parent.call(this, value)
}
Child.prototype = new Parent();
let child = new Child("adsionli")

//寄生组合继承
const Parent2 = function(value) {
    this.value = value;
}
Parent2.prototype.getValue = function() {
    console.log(this.value);
}
const Child2 = function(value) {
    Parent.call(this, value)
} 
Child2.prototype = Object.create(Parent.prototype);

let child2 = new Child2("shirley")

console.log(child);
console.log(child2);
