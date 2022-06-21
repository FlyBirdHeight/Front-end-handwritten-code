type VNode = {
    type: string,
    children: any,
    props: object,
    el: Document
}

interface RenderOptions {
    createElement(tag: any),
    setElement(el: any, text: string | any),
    insert(el: any, parent: any, anchor: any | null),
    patchProps(el: any, key: string, prevValue: any, nextValue: any)
}
function shouldSetAsProps(el, key, value) {
    if (key === 'form' && el.tagName === 'INPUT') return false;
    return key in el;
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

const options: RenderOptions = {
    createElement(tag) {
        return document.createElement(tag);
    },
    setElement(el: any, text: any) {
        el.textContent = text;
    },
    insert(el: any, parent: any, anchor: any | null) {
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
                        if(Array.isArray(invoker.value)) {
                            invoker.value.forEach(func => {
                                func(e)
                            })
                        }else {
                            invoker.value(e);
                        }
                    }
                    invoker.value = nextValue;
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
    }
}
const unmounted = (vnode: any) => {
    const parent = vnode.el.parentNode;
    if (parent) {
        parent.removeChild(vnode.el)
    }
}
function mountElement(vnode: VNode, container) {
    const el = vnode.el = options.createElement(vnode.type)
    if (vnode.props) {
        for (const key in vnode.props) {
            options.patchProps(el, key, null, vnode.props[key])
        }
    }


    if (typeof vnode.children === 'string') {
        options.setElement(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
        vnode.children.forEach(v => {
            patch(null, v, el);
        })
    }

    options.insert(el, container, null);
}
function patchElement(n1: VNode, n2: VNode) {

}
function patch(n1: VNode | undefined, n2: VNode, container) {
    if (n1 && n1.type !== n2.type) {
        unmounted(n1);
        n1 = null;
    }
    const { type } = n2;
    if (typeof type === 'string') {
        if (!n1) {
            mountElement(n2, container);
        } else {
            patchElement(n1, n2);
        }
    }
    if (typeof type === 'object') {
        //NOTE: 这个n2挂载的type就是一个组件，就需要对组件进行处理
    } else if (type === null) {
        //NOTE: 专门用来处理其他类型的vnode
    }

}
function createRenderer(options: RenderOptions) {


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
}