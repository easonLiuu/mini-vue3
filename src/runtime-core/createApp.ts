import { render } from "./renderer"
import { createVNode } from "./vnode"

export function createApp(rootComponent) {
    return {
        mount(rootContainer){
            // component -> vnode
            //先转换虚拟节点 后面所有逻辑基于虚拟节点
            const vnode = createVNode(rootComponent)
            render(vnode, rootContainer)
        }
    }
}
