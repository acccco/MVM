export function initEvent(rd) {
  if (rd.$parent) {
    rd.$innerEmit = rd.$emit
    rd.$emit = function (eventName, ...args) {
      rd.$parent && rd.$parent.$emit(eventName, ...args)
      rd.$innerEmit(rd, eventName, ...args)
    }
  }
}