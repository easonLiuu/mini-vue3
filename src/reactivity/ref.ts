import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
    private _value: any;
    private _rawValue: any;
    public dep;
    public __v_isRef = true;
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

export function isRef (ref) {
    return !!ref.__v_isRef
}

export function unRef (ref) {
    //看看是不是ref对象 ref -> ref.value
    //反之直接返回值
    return isRef(ref) ? ref.value : ref
}

export function proxyRefs (objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get(target, key) {
            return unRef(Reflect.get(target, key))
        },
        set(target, key, value) {
            if(isRef(target[key]) && !isRef(value)) {
                return target[key].value = value
            } else {
                return Reflect.set(target, key, value)
            }
        }
    })
}