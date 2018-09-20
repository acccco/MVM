import {afterMergeOptionType, injectObj, optionType, propObj} from "./option"
import {EventInterface} from "./event"
import {WatcherInterface} from "./watcher"
import {ComputedInterface} from "./computed"

export interface RDInterface extends EventInterface {
  id: number
  active: boolean
  $option: afterMergeOptionType
  $parent: RDInterface | null
  $root: RDInterface
  $children: Array<RDInterface>
  _inject: injectObj
  _provide: object
  _prop: propObj
  _data: object
  _computed: object
  _watch: Array<WatcherInterface>
  _computedWatcher: Array<ComputedInterface>

  [propName: string]: any
}

type classRD = {
  super?: classRD
  cid: number
  option: {
    _base: classRD
    [propName: string]: any
  }
  extend: (extendOption: optionType) => any
  mixin: (mixin: optionType) => this
  use: (plugin: any, ...args: Array<any>) => this
}
