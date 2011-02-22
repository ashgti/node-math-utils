var Buffer = require('buffer').Buffer;
var binding = require("./build/default/math.utils.node");

function UniformRandom(min, max, seed) {
    this.min = min || 0;
    this.max = max || 1;
    this.seed = new Buffer(8);
    
    if (seed) {
        // Since the drand48 function requires 48 bits of space to store 
        // the seed in, we need a buffer with 6 * 8 bits = 48 bits, plus
        // we 2 extra spaces just in case;
        this.seed[0] = seed & 0x0f;
        this.seed[1] = seed & 0x0f0;
        this.seed[2] = seed & 0x0f00;
        this.seed[3] = seed & 0x0f000;
        this.seed[4] = seed & 0x0f0000;
        this.seed[5] = seed & 0x0f00000;
    }
    else {
        // If no seed was provied, we use milliseconds to seed our generator
        var milli = (new Date()).getMilliseconds();
        this.seed[0] = milli & 0x0f;
        this.seed[1] = milli & 0x0f0;
        this.seed[2] = milli & 0x0f00;
        this.seed[3] = milli & 0x0f000;
        this.seed[4] = milli & 0x0f0000;
        this.seed[5] = milli & 0x0f00000;
    }    
}

UniformRandom.prototype.next = binding.UniformNext;

function Random(seed) {
    this.prototype.UniformRandom.call(this, 0, 1.0, seed);
}

Random.prototype = new UniformRandom;

function ExponentialRandom(lambda, seed) {
    this.lambda = lambda;
    this.uniform = new UniformRandom(0, 1.0, seed);
}

ExponentialRandom.prototype.next = function ExpontentialRandomNext() {
    return -this.lambda * Math.log(this.uniform.next());
}

exports.Random = Random;
exports.UniformRandom = UniformRandom;
exports.ExponentialRandom = ExponentialRandom;
