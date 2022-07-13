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
        if (newStart.key === oldStart.key) {
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
            this.insert(oldEnd.el, container, oldStart.el.nextSibling);
            newStart = newChildren[++newChildStart];
            oldEnd = oldChildStart[--oldChildEnd]
        }
    }
}