import {Watcher} from "../../toolbox/Watcher";

export function initPatch(vm) {

    vm.patch = vm.$options.patch.bind(vm)
    vm.patchCallback = vm.$options.patchCallback.bind(vm)
    new Watcher(vm, vm.patch, (newValue, oldValue) => {
        vm.patchCallback(newValue, oldValue)
    })

}