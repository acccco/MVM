export const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeDestroy',
    'destroyed'
]

export function callHook(rd, hook) {
    const handlers = rd.$options[hook]
    if (handlers) {
        for (let i = 0, j = handlers.length; i < j; i++) {
            handlers[i].call(rd)
        }
    }
    rd.$emit('hook:' + hook)
}