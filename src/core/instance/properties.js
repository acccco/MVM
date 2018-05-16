export function initProperties(vm) {
    let parent = vm.$options.parent
    if (parent) {
        parent.$children.push(vm)
    }
    vm.$parent = parent
    vm.$root = parent ? parent.$root : vm
    vm.$children = []
}