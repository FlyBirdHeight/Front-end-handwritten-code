import { VNode } from "../render";

const DoubleDiff = function (newChildren: VNode[], oldChildren: VNode[], container: Node) {
    let newChildStart = 0;
    let newChildEnd = newChildren.length - 1;
    let oldChildStart = 0;
    let oldChildEnd = oldChildren.length - 1;

    let newStart = newChildren[newChildStart];
    let newEnd = newChildren[newChildEnd];
    let oldStart = oldChildren[oldChildStart];
    let oldEnd = oldChildren[oldChildEnd];
    while (newChildEnd >= newChildStart && oldChildEnd >= oldChildStart) {
        //README: 如果节点为undefined，说明之前已经处理过了，是属于特殊情况，那么直接跳过就可以了
        if (!oldStart) {
            oldStart = oldChildren[++oldChildStart];
        } else if (!oldEnd) {
            oldEnd = oldChildren[--oldChildEnd];
        } else if (newStart.key === oldStart.key) {
            this.patch(oldStart, newStart, container);
            newStart = newChildren[++newChildStart];
            oldStart = oldChildStart[++oldChildStart]
        } else if (newEnd.key === oldEnd.key) {
            this.patch(oldEnd, newEnd, container);
            newEnd = newChildren[--newChildEnd];
            oldEnd = oldChildStart[--oldChildEnd]
        } else if (newEnd.key === oldStart.key) {
            this.patch(oldStart, newEnd, container);
            this.insert(oldStart.el, container, oldEnd.el.nextSibling);
            newEnd = newChildren[--newChildEnd];
            oldStart = oldChildStart[++oldChildStart]
        } else if (newStart.key === oldEnd.key) {
            this.patch(oldEnd, newStart, container);
            this.insert(oldEnd.el, container, oldStart.el);
            newStart = newChildren[++newChildStart];
            oldEnd = oldChildStart[--oldChildEnd]
        } else {
            let oldIdx = oldChildren.findIndex(vnode => vnode.key === newStart.key);
            /**
             * README: 如果存在可复用Dom，那么就是代表需要更新顺序，那么就可以进行patch和节点移动，
             * 然后我们还需要将oldChildren位置上的节点设为undefined，代表已经处理过了
             */
            if (oldIdx > 0) {
                this.patch(oldChildren[oldIdx], newStart, container);
                this.insert(oldChildren[oldIdx], container, oldStart);
                oldChildren[oldIdx] = undefined;
            } else {
                //README: 如果不大于0，那么返回的一定是-1，也就是新增节点，直接去进行挂载初始化
                this.patch(null, newStart, container)
            }
            //README: 移动newChildren的start指针
            newStart = newChildren[++newChildStart];
        }
    }
    //NOTE: 如果是新增节点的话，进行如下判断，此时旧节点的集合已经遍历完成，但是新节点结合还有节点未放入，那么就说明新增了节点
    if (oldChildEnd > oldChildStart && newChildStart <= newChildEnd) {
        for (let i = newChildStart; i <= newChildEnd; i++) {
            this.patch(null, newChildren[i], container, oldStart.el)
        }

    } else if (newChildStart > newChildEnd && oldChildStart <= oldChildEnd) {
        //NOTE: 如果是移除节点的话，进行如下判断，新增节点已经遍历完成，此时newChildStart会因为p1相同而加1，所以会大于newChildEnd，且此时旧节点的集合未遍历完，说明存在需要卸载的节点
        for (let i = oldChildStart; i <= oldChildEnd; i++) {
            this.unmount(oldChildren[i]);
        }
    }

}