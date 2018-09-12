import {commomObject} from "./commom"

export interface DepInterface {
  id: number
  monitor: {
    object: commomObject
    key: string
  }
  subs: Array<any>
  addSub: (sub: any) => void
  removeSub: (sub: any) => void
  notify: () => void
}
