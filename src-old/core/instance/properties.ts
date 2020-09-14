import {RD} from "../"

/**
 * 确定实例的父子关系
 * @param {RD} rd
 */
export function initProperties(rd: RD) {
  let parent = rd.$option.parent
  if (parent) {
    parent.$children.push(rd)
  }
  rd.$parent = parent
  rd.$root = parent ? parent.$root : rd
}
