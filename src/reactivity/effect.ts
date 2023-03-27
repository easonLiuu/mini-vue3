import { extend } from "../shared";

class ReactiveEffect{
    private _fn: any;
    deps = [];
    active = true;
    onStop?: () => void;
    public scheduler: Function | undefined;
    constructor(fn, scheduler?: Function){
        this._fn = fn
        this.scheduler = scheduler
    }
    run() {
        activeEffect = this
        return this._fn()
    }
    stop () {
        if (this.active) {
            cleanUpEffect(this)
            if (this.onStop) {
                this.onStop()
            }
            this.active = false
        }
    }
}
function cleanUpEffect (effect) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect)
    });
}
const targetMap = new Map()
export function track(target, key) {
    // target -> key -> dep
    let depsMap = targetMap.get(target)
    // 初始化
    if(!depsMap){
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if(!dep){
        dep = new Set()
        depsMap.set(key, dep)
    }
    if (!activeEffect) return
    dep.add(activeEffect)
    //反向收集
    activeEffect.deps.push(dep)
    // const dep = new Set()
}
export function trigger(target, key) {
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)
    for (const effect of dep) {
        if(effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}
let activeEffect

export function effect (fn, options: any = {}) {
    //fn
    const _effect = new ReactiveEffect(fn, options.scheduler)
    // Object.assign(_effect, options)
    // extends
    extend(_effect, options)
    // _effect.onStop = options.onStop
    _effect.run()
    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect
    return runner
}

export function stop (runner) {
    runner.effect.stop()
}