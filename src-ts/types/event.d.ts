import {commonObject} from "./commom"

export type eventFunType = {
  (event: commonObject): any
  [propName: string]: any
}

export type eventGroup = {
  [propName: string]: Array<eventFunType>;
}

export interface EventInterface {
  id: number
  _events: eventGroup
  $on: (eventName: string, fn: Array<eventFunType> | eventFunType) => this
  $once: (eventName: string, fn: eventFunType) => this
  $off: (eventName: string, fn?: Array<eventFunType> | eventFunType) => this
  $emit: (eventName: string, args?: Array<any>) => this
}
