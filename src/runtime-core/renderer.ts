import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
    // patch
    patch(vnode, container)

}

function patch(vnode, container) {
    //处理组件
    //判断是不是element类型
    processComponent(vnode, container)
}

function processComponent(vnode: any, container: any) {
    mountComponent(vnode, container)
}
function mountComponent(vnode: any, container) {
    const instance = createComponentInstance(vnode)
    setupComponent(instance)
    setupRenderEffect(instance, container)
}

function setupRenderEffect(instance: any, container ) {
    const subTree = instance.render()
    //vnode -> patch
    //vnode->element
    patch(subTree, container)
}

