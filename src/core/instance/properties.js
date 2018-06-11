export function initProperties(rd) {
  let parent = rd.$options.parent
  if (parent) {
    parent.$children.push(rd)
  }
  rd.$parent = parent
  rd.$root = parent ? parent.$root : rd
  rd.$children = []

  rd._watcher = []
}