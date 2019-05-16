import {WatcherInterface} from "./watcher"

export type computedHandle = {
  set: Function
  get: Function
}

export interface ComputedInterface {
  id: number
  active: boolean
  watch: WatcherInterface
  value: any

  destroy(): void
}
