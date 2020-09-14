import {RD} from "../"

/**
 * 将子节点的事件触发可以通知到父组件，实现子父节点间的通信
 * 两种方式实现事件传递
 * 1. 将需要监听的事件名以及处理函数通过 $option.event 对象传递
 * 2. 直接在父节点上通过 this.$on 来实现
 * @param {RD} rd
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
  if (rd.$option.event) {
    let event = rd.$option.event
    Object.keys(event).forEach(key => {
      rd.$on(key, event[key])
    })
  }
}
