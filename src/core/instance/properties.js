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