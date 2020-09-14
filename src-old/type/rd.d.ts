import {commonObject} from "./commom"
import {optionType} from "./option"
import {EventInterface} from "./event"
import {watcherCallback, watcherOption, WatcherInterface} from "./watcher"

export interface RDInterface extends EventInterface {
  id: number
  active: boolean
  $option: optionType
  $parent: RDInterface | null
  $root: RDInterface
  $children: Array<RDInterface>
  _inject: commonObject
  _provide: commonObject
  _prop: commonObject
  _data: commonObject
  _computed: commonObject
  _watch: Array<WatcherInterface>
  _proxy: WindowProxy | RDInterface

  [name: string]: any

  _init(option: optionType): void

  $initProp(prop: object): void

  $watch(getter: string | (() => any), callback: watcherCallback, option: watcherOption): WatcherInterface

  $destroy(): void
}

type classRD = {
  super?: classRD
  cid: number
  option: {
    _base: classRD
    [propName: string]: any
  }
  extend: (extendOption: optionType) => any
  mixin: (mixin: optionType) => any
  use: (plugin: any, ...args: Array<any>) => any
  _installedPlugins?: Array<any>
}
