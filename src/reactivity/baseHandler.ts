import { extend, isObject } from "../shared"
import { track, trigger } from "./effect"
import { reactive, readonly, ReactiveFlags } from "./reactive"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)
function createGetter (isReadonly = false, shallow = false) {
    return function get (target, key) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        }
        const res = Reflect.get(target, key)
        if (shallow) {
            return res
        }
        //看看res是不是object
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res)
        }
        if (!isReadonly) {
            //依赖收集
            track(target, key)
        }
        return res
    }
}

function createSetter () {
    return function set (target, key, value) {
        const res = Reflect.set(target, key, value)
        //触发依赖
        trigger(target, key)
        return res
    }
}
export const mutableHandlers = {
    get,
    set,
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key: ${key} set failed because target is readonly`, target);
        return true
    }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
}) 