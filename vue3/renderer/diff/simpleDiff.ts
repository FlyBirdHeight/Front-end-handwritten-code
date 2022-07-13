import { VNode } from "../render";

const simpleDiff01 = function (n1: VNode, n2: VNode, el: any) {
    const oldChildren = n1.children;
    const newChildren = n2.children;
    const oL = n1.children.length;
    const nL = n2.children.length;
    const commonLength = Math.min(oL, nL);
    for (let i = 0; i < commonLength; i++) {
        this.patch(oldChildren[i], newChildren[i], el);
    }
    if (nL > oL) {
        for (let i = commonLength; i < nL; i++) {
            this.patch(null, newChildren[i], el)
        }
    } else if (oL > nL) {
        for (let i = commonLength; i < oL; i++) {
            this.unmounted(oldChildren[i]);
        }
    } else {

    }
}

const simpleDiff02 = function (n1: VNode, n2: VNode, container: any) {
    const oldChildren = n1.children;
    const newChildren = n2.children;
    let lastIndex = 0;
    //README: 这里主要负责是节点的移动和新增
    for (let i = 0; i < newChildren.length; i++) {
        const children = newChildren[i];
        let find = false;
        for (let j = 0; j < oldChildren.length; i++) {
            if (children.key === oldChildren[i].key) {
                find = true;
                this.patch(oldChildren[j], children, container)
                //NOTE: 引入lastIndex判断节点是否移动
                if (lastIndex > j) {
                    //如果lastIndex>j了，说明节点一定发生了移动，那么就需要调整dom顺序
                    //因为新的children顺序一定就是最终real-dom的顺序，所以只需要获取前一个对应的真实Dom，然后通过nextSibling（也是Node的）就可以获取紧随其后的node，然后更新掉
                    let preVNode = newChildren[i - 1]
                    if (preVNode) {
                        let anchor = preVNode.el.nextSibling;
                        insert(oldChildren[i].el, container, anchor);
                    }
                } else {
                    //如果当前的节点在oldChildren中的索引不小于最大索引值的话，就不动他，让其他的节点动，所以更新lastIndex
                    lastIndex = j;
                }
                break;
            }
        }
        if(!find) {
            let preVNode = newChildren[i - 1];
            let anchor;
            if(preVNode) {
                anchor = preVNode.el.nextSibling;
            }else {
                anchor = container.firstChild;
            }
            //NOTE: 没有的节点一定是要进行挂载的,同时在patch中新增锚点属性
            this.patch(null, newChildren[i], container, anchor);
        }
    }
    //README: 这里主要负责的是节点的删除
    for(let i = 0; i < oldChildren.length; i++) {
        const oldVNode = oldChildren[i];
        const has = newChildren.find(v => v.key === oldVNode.key);
        if(has) {
            this.unmount(oldVNode);
        }
    }
}

const insert = (el, parent, anchor = null) => {
    //insertBefore是Node的内置函数，用于添加到childrenNode中
    parent.insertBefore(el, anchor);
}

export {
    simpleDiff01,
    simpleDiff02
}