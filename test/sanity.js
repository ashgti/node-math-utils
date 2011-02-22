var Utils = require("../math.utils.js");
var b = new Utils.UniformRandom(0, 1);

console.log("Test some basics..." + b.next() + " : " + b.next());

var c = new Utils.ExponentialRandom(4);

for (var i = 0; i < 10; i++)
    console.log(c.next());