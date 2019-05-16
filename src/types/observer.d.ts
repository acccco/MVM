import {DepInterface} from "./dep"
import {commonObject} from "./commom"

export interface ObserverInterface {
  id: number
  dep: DepInterface
  walk: (obj: commonObject) => void
  observeArray: (items: Array<any>) => void
}
