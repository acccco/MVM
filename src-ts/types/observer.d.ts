import {DepInterface} from "./dep"
import {commomObject} from "./commom"

export interface ObserverInterface {
  id: number
  dep: DepInterface
  walk: (obj: commomObject) => void
  observeArray: (items: Array<any>) => void
}
