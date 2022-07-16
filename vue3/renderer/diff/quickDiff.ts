import { VNode } from "../render";

const generateLongestSubsequence = function (source: number[]) {
    let len = source.length;
    const p = source.slice();
    /**
     * @property {number[]} result 最终返回的最长递增子序列下标位置集合
     */
    const result = [0];
    let left, right, mid;
    let j;
    for (let i = 0; i < len; i++) {
        const targetIndex = source[i];
        if (targetIndex !== 0) {
            j = result[result.length - 1];
            //NOTE: 判断对比点的大小是否比原位置点的大，如果大的话，说明是递增点，直接放入result，注意，这里放的是下标
            if (source[j] > targetIndex) {
                //NOTE: 这里需要记录一下当前目标点的后一位递增子节点的下标，赋值到复制的那个数组上
                p[j] = i;
                result.push(i);
                continue;
            }
            //NOTE: 如果不是递增的，那么就需要去寻找前置的，小于当前位置的值，也就是使用寻找左边界的二分查找
            left = 0;
            right = result.length - 1;
            //NOTE: 因为result中存的是递增序列且是source的下标值，所以我们通过source[result[mid]]取到对应位置
            //README: 通过二分查找，找我们当前位置j在result中的对应位置，是否可以形成递增序列
            while (left < right) {
                let mid = (left + right) / 2 || 0;
                if (source[result[mid]] < targetIndex) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            //NOTE: 根据左边界进行判断，下标是否大于目标节点位置的值，如果大于，说明可以形成递增序列
            if (targetIndex < source[result[left]]) {
                //NOTE: 判断left是否是>0的节点，如果是的话，我们需要更新一下p中对应i下的值，以便保存递增子序列的下标记录
                if (left > 0) {
                    p[i] = result[left - 1];
                }
                //README: 同时我们还需去更新一下result对应left下标的值的索引为当前i
                //NOTE: 因为只需要返回一组递增子序列的情况，所以可以直接更新
                result[left] = i;
            }
        }
    }
    //最后我们需要把记录在p数组中的对应result长度的递增子序列的下标取出来，放入result中进行返回
    let resultP = result.length;
    let returnIndex = result[resultP - 1];
    while (resultP-- > 0) {
        result[resultP] = returnIndex;
        returnIndex = p[resultP];
    }
    //NOTE: 本方法，实际用的就是贪心+二分的形式，获取最长递增子序列
    return result;
}

const quickDiff = function (newChildren: VNode[], oldChildren: VNode[], container: Node) {
    let j = 0;
    let newEnd = newChildren.length - 1;
    let oldEnd = oldChildren.length - 1;
    //NOTE: 前置预处理
    while (newChildren[j].key === oldChildren[j].key) {
        this.patch(oldChildren[j], newChildren[j], container);

        j++;
    }
    //NOTE: 后置节点预处理
    while (newChildren[newEnd].key === oldChildren[oldEnd].key) {
        this.patch(oldChildren[j], newChildren[j], container);

        newEnd--;
        oldEnd--;
    }
    //NOTE: 这里进行卸载和装载的判断，要选取合适的锚点位置
    if (newEnd < j && oldEnd >= j) {
        //README: 这里就是卸载的情况，说明有节点被卸载了，而且范围是在j到oldEnd之间的内容
        for (let i = j; i <= oldEnd; i++) {
            this.unmount(oldChildren[i]);
        }
    } else if (newEnd >= j && oldEnd < j) {
        //NOTE: 这里不知道是不是写错了，他这里应该是挂载在j下标的节点后面才对，书上写的是newEnd + 1，很奇怪，不知道对不对
        let anchorIndex = j + 1;
        let anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null;
        //README: 这里就是装载的情况，说明在newChildren中，存在新增加的节点，且范围是在j到newEnd之间
        for (let i = j; i <= newEnd; i++) {
            this.patch(null, newChildren[i], container, anchor);
        }
    } else {
        //在非理想情况下，不会存在那么直接的结果，而是会存在需要移动的节点的，所以需要特殊处理
        /**
         * @property {boolean} move 是否需要移动
         * @property {number} handleCount 等待处理的新节点的数量
         * @property {number[]} source 映射表，新节点位置映射到oldChildren上的位置记录
         * @property {number} patched 更新过的节点数量
         * @property {number} pos 相当于lastIndex，用来记录最大的节点的位置下标，协助判断是否移动了节点
         * @property {*} newChildrenKeyIndex 用来映射key对应在newChildren中的位置下标
         */
        let move = false;
        const handleCount = newEnd - j + 1;
        const source = new Array(handleCount).fill(-1);
        const oldStart = j;
        const newStart = j;

        let patched = 0;
        let pos = 0
        let newChildrenKeyIndex = {}
        for (let i = 0; i < newChildren.length; i++) {
            newChildrenKeyIndex[i] = newChildren[i].key;
        }
        //NOTE: 建立映射关系，并且卸载不需要的节点
        for (let i = 0; i < oldChildren.length; i++) {
            let oldNode = oldChildren[i];
            if (patched < handleCount) {
                let k = newChildrenKeyIndex[oldNode.key];
                /**
                 * README:如果可以从newChildrenKeyIndex映射中拿到对应的值的话，
                 * 说明当前节点在新节点组中也存在，如果不存在，就说明被卸载了
                 * README: oldChildren是拿不到需要新增节点的，所以只会是被卸载节点
                 */
                if (typeof k !== 'undefined') {
                    let newNode = newChildren[k];
                    //NOTE: 更新节点并维护patched的大小
                    this.patch(oldNode, newNode, container);
                    patched++;
                    //NOTE: 设置映射表，并判断是否需要进行节点移动
                    source[k - newStart] = i;
                    if (k < pos) {
                        move = true;
                    } else {
                        pos = k;
                    }
                } else {
                    this.unmount(oldNode);
                }
            } else {
                //README: 如果更新的数量已经超过了newChildren需要处理的数量，那么肯定oldChildren剩下的节点都被卸载了
                this.unmount(oldNode);
            }
        }

        if (move) {
            //NOTE: 获取到最长递增子序列之后，按照双指针进行循环
            let lis = generateLongestSubsequence(source);
            //README: lisEnd作为lis最长递增子序列的尾部指针，用来处理需要处理的位置
            let lisEnd = lis.length - 1;
            //这里要处理的数据的长度，就是之前获取到的handleCount的长度
            for (let i = handleCount - 1; i >= 0; i--) {
                //等于-1说明是新增的节点
                if (source[i] == -1) {
                    //这里Pos要加上newStart是因为这里的开始位置是从newStart位置开始的，实际位置在newChildren中是i+newStart
                    const pos = i + newStart;
                    const newVNode = newChildren[pos];
                    //NOTE: 这里获取nextPos，是因为Insert中用的Node.prototype.insertBefore这个方法
                    const nextPos = pos + 1;
                    const anchor = nextPos < newChildren.length ? newChildren[nextPos] : null;
                    //因为是新增的节点，所以只需要挂载即可
                    this.patch(null, newVNode, container, anchor)
                } else if (i !== lis[lisEnd]) {
                    const pos = i + newStart;
                    const newVNode = newChildren[pos];
                    const nextPos = pos + 1;
                    const anchor = nextPos < newChildren.length ? newChildren[nextPos] : null;
                    //只需要挂载即可
                    this.insert(newVNode, container, anchor)
                } else {
                    //NOTE: 位置没有改变的话，尾指针位置更新
                    lisEnd--;
                }
            }
        }
    }
}
