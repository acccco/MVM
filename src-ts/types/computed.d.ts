import {WatcherInterface} from "./watcher"
import {commonObject} from "./commom"

export interface ComputedInterface {
  id: number
  ctx: any
  key: string
  option: commonObject
  active: boolean
  watch: null | WatcherInterface
  value: any
  _init: () => void
  destroy: () => void
}
