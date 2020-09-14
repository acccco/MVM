import {RD} from "../"

export const LIFECYCLE_HOOK: Array<string> = [
  'beforeCreate',
  'created',
  'beforeDestroy',
  'destroyed'
]

/**
 * 触发实例下的对应生命周期，同时触发对应事件，用于用户自定义制定对应处理事件
 * @param {RD}      rd
 * @param {string}  hookName
 */
export function callHook(rd: RD, hookName: string) {
  const handler = rd.$option[hookName]
  if (handler) {
    for (let i = 0, j = handler.length; i < j; i++) {
      handler[i].call(rd)
    }
  }
  rd.$emit('hook:' + hookName)
}
