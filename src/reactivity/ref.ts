import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
    private _value: any;
    private _rawValue: any;
    public dep;
    constructor(value) { 
        this._rawValue = value
        // this._value = isObject(value) ? reactive(value) : value
        this._value = convert(value)
        // value -> reactive
        // value是不是对象 是的话 用reactive包裹一下
        this.dep = new Set()
    }
    get value() {
        trackRefValue(this)
        return this._value
    }
    set value(newValue) {
        // hasChanged
        if(hasChanged(newValue, this._rawValue)) {
            this._rawValue = newValue
            // this._value = isObject(newValue) ? reactive(newValue) : newValue
            this._value = convert(newValue)
            //先去修改value 再通知
            triggerEffects(this.dep)
        }
    }
}

function convert(value) {
    return isObject(value) ? reactive(value) : value
}

function trackRefValue(ref) {
    if(isTracking()) {
        trackEffects(ref.dep)
    }
}

export function ref (value) {
    return new RefImpl(value)
}