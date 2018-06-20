/**
 * 初始化类下的一些必要属性以及确定实例的父子关系
 * @param rd
 */
export function initProperties(rd) {
  let parent = rd.$option.parent
  if (parent) {
    parent.$children.push(rd)
  }
  rd.$parent = parent
  rd.$root = parent ? parent.$root : rd
  rd.$children = []

  rd._watch = []
}