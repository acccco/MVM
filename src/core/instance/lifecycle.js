export const LIFECYCLE_HOOK = [
  'beforeCreate',
  'created',
  'beforeDestroy',
  'destroyed'
]

export function callHook(rd, hook) {
  const handler = rd.$option[hook]
  if (handler) {
    for (let i = 0, j = handler.length; i < j; i++) {
      handler[i].call(rd)
    }
  }
  rd.$emit('hook:' + hook)
}