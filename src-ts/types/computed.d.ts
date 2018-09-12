import {WatcherInterface} from "./watcher"
import {commomObject} from "./commom"

export interface ComputedInterface {
  id: number
  ctx: any
  key: string
  option: commomObject
  active: boolean
  watch: null | WatcherInterface
  value: any
  init: () => void
  teardown: () => void
}
