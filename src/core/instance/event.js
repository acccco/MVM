/**
 * 将子组件的事件触发可以通知到父组件，实现子父组件间的通信
 * @param rd
 */
export function initEvent(rd) {
  if (rd.$parent) {
    rd.$innerEmit = rd.$emit
    rd.$emit = function (eventName, ...args) {
      rd.$parent && rd.$parent.$emit(eventName, ...args)
      rd.$innerEmit(rd, eventName, ...args)
    }
  }
}