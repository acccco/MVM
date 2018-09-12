import {commomObj} from "./commom.d.js"

export type eventFunType = {
  (event: commomObj): any
  [propName: string]: any
}

export interface EventInterface {
  id: number
  _events: commomObj
  $on: (eventName: string, fn: Array<eventFunType> | eventFunType) => this
  $once: (eventName: string, fn: eventFunType) => this
  $off: (eventName: string, fn?: Array<eventFunType> | eventFunType) => this
  $emit: (eventName: string, args?: Array<any>) => this
}
