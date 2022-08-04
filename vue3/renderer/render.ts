import { simpleDiff01 } from "./diff/simpleDiff";

type VNode = {
    type: { render: any, data: any } | string | Symbol,
    children: string | VNode[] | VNode | null | any,
    props: object,
    el: Node,
    key: number
}

interface RenderOptions {
    createElement(tag: any),
    setElement(el: Node, text: string | any),
    insert(el: Node, parent: any, anchor?: any | null),
    patchProps(el: Node, key: string, prevValue: any, nextValue: any),
    createText(value: string),
    setText(el: Node, value: string)
}

function shouldSetAsProps(el, key, value) {
    if (key === 'form' && el.tagName === 'INPUT') return false;
    return key in el;
}
const options: RenderOptions = {
    createElement(tag) {
        return document.createElement(tag);
    },
    setElement(el: any, text: any) {
        el.textContent = text;
    },
    insert(el: any, parent: any, anchor: any | null = null) {
        parent.insertBefore(el, anchor);
    },
    patchProps(el: any, key: string, prevValue: any, nextValue: any) {
        const type = typeof el[key];
        if (/^on/.test(key)) {
            let invokers = el._vei || (el._vei = {})
            let invoker = invokers[key];
            const eventName = key.slice(2).toLowerCase();
            if (nextValue) {
                if (!invoker) {
                    invoker = el._vei[key] = (e) => {
                        if (Array.isArray(invoker.value)) {
                            if (e.timeStamp < invoker.attach) {
                                return
                            }
                            invoker.value.forEach(func => {
                                func(e)
                            })
                        } else {
                            invoker.value(e);
                        }
                    }
                    invoker.value = nextValue;
                    //NOTE: 这里使用的是高精度事件，避免事件处理过快
                    invoker.attach = performance.now();
                    el.addEventListener(name, invoker)
                } else {
                    invoker.value = nextValue;
                }
            } else if (invoker) {
                el.removeEventListener(eventName, invoker)
            }
        }
        if (key === 'class') {
            el.className = nextValue
        } else if (shouldSetAsProps(el, key, nextValue)) {
            if (type === 'boolean' && nextValue === '') {
                el[key] = true;
            } else {
                el[key] = nextValue;
            }
        } else {
            el.setAttribute(key, nextValue)
        }
    },
    createText(value: string) {
        return document.createTextNode(value);
    },
    setText(el: Document, value: string) {
        el.nodeValue = value;
    }
}
function handleNormalizeClass(value: any): string[] {
    let returnData = [];
    const type = Array.isArray(value) ? 'array' : typeof value;
    if (type === 'string') {
        return [value];
    }
    if (type === 'array') {
        for (let key in value) {
            returnData = returnData.concat(handleNormalizeClass(value[key]))
        }
    } else if (type === 'object') {
        for (let key in value) {
            const keyType = typeof value[key]
            if (keyType === 'object') {
                returnData = returnData.concat(handleNormalizeClass(value[key]))
            } else {
                if (keyType === 'boolean' && value[key]) {
                    returnData.push(key)
                }
                if (keyType === 'string') {
                    returnData.push(value[key])
                }
            }
        }
    }

    return returnData;
}

const normalizeClass = (value: any) => {
    return handleNormalizeClass(value).join(" ")
}

function createRenderer(options: RenderOptions) {
    const Text = Symbol();
    const Comment = Symbol();
    const Fragment = Symbol();
    function render(vnode: VNode, container) {
        if (vnode) {
            //NOTE: 处理更新update与挂载mount
            patch(container._vnode, vnode, container)
        } else {
            if (container._vnode) {
                unmounted(container._vnode)
            }
        }
        container._vnode = vnode
    }

    const unmounted = (vnode: VNode) => {
        //NOTE: 因为Fragment是不被渲染的，所以我们需要主动去卸载其下的chilren
        if (vnode.type === Fragment) {
            vnode.children.forEach(child => {
                unmounted(child)
            })
            return;
        }
        const parent = vnode.el.parentNode;
        if (parent) {
            parent.removeChild(vnode.el)
        }
    }
    function mountElement(vnode: VNode, container, anchor: Node | null) {
        const el = vnode.el = options.createElement(vnode.type)

        if (typeof vnode.children === 'string') {
            options.setElement(el, vnode.children);
        } else if (Array.isArray(vnode.children)) {
            //如果vnode的children是一个数组的话，说明具有很多个子节点，就需要去遍历挂载或者更新
            vnode.children.forEach(v => {
                patch(null, v, el);
            })
        }
        if (vnode.props) {
            for (const key in vnode.props) {
                options.patchProps(el, key, null, vnode.props[key])
            }
        }
        options.insert(el, container, anchor);
    }
    function patchElement(n1: VNode, n2: VNode) {
        //README: 这里就是进行DOM复用，在复用了DOM元素之后，新节点将持有对真实DOM的引用
        const el = n2.el = n1.el;
        const newProps = n2.props;
        const oldProps = n1.props;

        for (const key in newProps) {
            if (newProps[key] !== oldProps[key]) {
                options.patchProps(el, key, oldProps[key], newProps[key])
            }
        }
        for (const key in oldProps) {
            if (!(key in newProps)) {
                options.patchProps(el, key, oldProps[key], null);
            }
        }
        //NOTE: 更新子节点
        patchChildren(n1, n2, el);
    }
    function patchChildren(n1: VNode, n2: VNode, el: Node) {
        if (typeof n2.children === 'string') {
            if (Array.isArray(n1.children)) {
                n1.children.forEach(child => {
                    unmounted(child)
                })
            }

            options.setElement(n2.el, n2.children);
        } else if (Array.isArray(n2.children)) {
            if (Array.isArray(n1.children)) {
                //NOTE: 这里就是diff算法处理了
                simpleDiff01.apply(this, [n1, n2]);
            } else {
                options.setElement(el, '');
                n2.children.forEach(child => {
                    patch(null, child, el);
                })
            }
        } else {
            if (Array.isArray(n1.children)) {
                n1.children.forEach(child => {
                    unmounted(child)
                })
            } else if (typeof n1.children === 'string') {
                options.setElement(el, '')
            }
        }
    }

    function patch(n1: VNode | undefined | null, n2: VNode, container, anchor: Node = null) {
        if (n1 && n1.type !== n2.type) {
            unmounted(n1);
            n1 = null;
        }
        const { type } = n2;
        if (typeof type === 'string') {
            if (!n1) {
                //挂载
                mountElement(n2, container, anchor);
            } else {
                //更新节点
                patchElement(n1, n2);
            }
        } else if (type === Text) {
            if (!n1) {
                const el = n2.el = options.createText(n2.children);
                options.insert(el, container);
            } else {
                const el = n2.el = n1.el;
                if (n2.children !== n1.children) {
                    options.setText(el, n2.children)
                }
            }
        } else if (type === Fragment) {
            if (!n1) {
                n2.children.forEach(child => {
                    patch(null, child, container);
                })
            } else {
                patchChildren(n1, n2, container);
            }
        }
        if (typeof type === 'object') {
            //NOTE: 这个n2挂载的type就是一个组件，就需要对组件进行处理
            if (!n1) {
                //挂载组件
                mountComponent(n2, container, anchor);
            } else {
                //更新组件
                patchComponent(n1, n2, anchor);
            }
        } else if (type === null) {
            //NOTE: 专门用来处理其他类型的vnode
        }

    }
    function mountComponent(vnode: VNode, container: any, anchor: any = null) {
        const componentOptions = vnode.type;
        const { render, data } = componentOptions;

        //README: data也是一个函数，用来获取自定义数据的内容，返回的是一个对象，所以可以使用reactive进行响应式数据改造
        const state = reactive(data());
        //README: 注册一个响应式副作用函数，一旦响应式数据发生改变，就刷新组件
        effect(() => {
            //NOTE: render是一个函数，用来获取描述组件所渲染内容的接口，绑定this上下文
            const subTree = render.call(state, state);
            patch(null, subTree, container, anchor);
        }, {
            //FIXME: 添加一个调度器，避免重复调度
            scheduler: queueJob
        })
    }
    /**
     * @method queueJob
     * @param job 
     * @description 使用防抖和微任务的思想，避免组件刷新重复进行
     */
    function queueJob(job) {
        const queue = new Set();
        let isFlushing = false;
        const p = Promise.resolve();

        return function(job) {
            queue.add(job);
            if(!isFlushing) {
                isFlushing = true;
                //TODO: 微任务的执行一定是在eventloop的最终阶段的
                p.then(() => {
                    try {
                        queue.forEach((job: any) => job())
                    }finally{
                        //NOTE: 当所有的任务执行完成之后，重置一下状态
                        isFlushing = false;
                        queue.clear();
                    }
                })
            }
        }
    }
}

export {
    VNode,
    createRenderer,
}