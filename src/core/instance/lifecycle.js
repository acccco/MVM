export const LIFECYCLE_HOOK = [
  'beforeCreate',
  'created',
  'beforeDestroy',
  'destroyed'
]

/**
 * 触发实例下的对应生命周期，同时触发对应事件，用于用户自定义制定对应处理事件
 * @param rd
 * @param hook
 */
export function callHook(rd, hook) {
  const handler = rd.$option[hook]
  if (handler) {
    for (let i = 0, j = handler.length; i < j; i++) {
      handler[i].call(rd)
    }
  }
  rd.$emit('hook:' + hook)
}