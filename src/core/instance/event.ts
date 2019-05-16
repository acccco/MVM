import {RD} from "../"

/**
 * 将子组件的事件触发可以通知到父组件，实现子父组件间的通信
 * @param rd
 */
export function initEvent(rd: RD) {
  if (rd.$parent) {
    rd.$innerEmit = rd.$emit
    rd.$emit = (eventName: string, ...args: Array<any>) => {
      rd.$parent && rd.$parent.$emit(eventName, ...args)
      rd.$innerEmit(eventName, ...args)
      return rd
    }
  }
}
