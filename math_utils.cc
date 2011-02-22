#include <node.h>
#include <node_buffer.h>
#include <iostream>
#include <cstdlib>
#include "math_utils.h"

using namespace v8;
using namespace std;
using namespace node;

/* Random number generators */
static Handle<Value> UniformRandom(const Arguments& args) {
    HandleScope scope;

    double d_min = 0, d_max = 1.0;
    Local<Object> that = args.This()->ToObject();
    Local<Value> min = that->Get(String::New("min"));
    Local<Value> max = that->Get(String::New("max"));
    Local<Object> seed = that->Get(String::New("seed"))->ToObject();
    if (Buffer::Length(seed) < 6) {
        return ThrowException(Exception::Error(
              String::New("Length is extends beyond buffer")));
    }
    union {
        char *seed_data_c;
        uint16_t *seed_data_us;
    } seed_data;
    seed_data.seed_data_c = Buffer::Data(seed);
    if (min->IsNumber()) {
        d_min = min->NumberValue();
    }
    else {
        d_min = 0.0;
    }
    if (max->IsNumber()) {
        d_max = max->NumberValue();
    }
    else {
        d_max = 1.0;
    }

    double result = (erand48(seed_data.seed_data_us) * (d_max - d_min)) + d_min;
    
    return scope.Close(Number::New(result));
}

/* Range */

extern "C" void
init (Handle<Object> target) {
    HandleScope scope;
    
    NODE_SET_METHOD(target, "UniformNext", UniformRandom);
}

