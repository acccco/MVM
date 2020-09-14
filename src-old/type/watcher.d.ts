import {DepInterface} from "./dep"

export type watcherCallback = (newValue: any, oldValue: any) => any

export type watcherOption = {
  lazy?: boolean
  deep?: boolean
  ignoreChange?: boolean
  initCallback?: boolean
}

export interface WatcherInterface {
  id: number
  active: boolean
  lazy: boolean
  dirty: boolean
  deep: boolean
  ignoreChange: boolean
  initCallback: boolean
  dep: Array<DepInterface>
  depId: Set<number>
  newDep: Array<DepInterface>
  newDepId: Set<number>
  value: any
  getter: () => any
  cb: watcherCallback

  get(): any

  update(): void

  run(): void

  evaluate(): void

  addDep(dep: DepInterface): void

  cleanupDep(): void

  destroy(): void
}
