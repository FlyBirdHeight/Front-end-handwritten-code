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

const simpleDiff02 = function (n1: VNode, n2: VNode, el: any) {
    const oldChildren = n1.children;
    const newChildren = n2.children;
    for (let i = 0; i < newChildren.length; i++) {
        const children = newChildren[i];
        for (let j = 0; j < oldChildren.length; i++) {
            if (children.key === oldChildren[i].key) {
                this.patch(oldChildren[i], children, el)
                break
            }
        }
    }
}

export {
    simpleDiff01,
    simpleDiff02
}