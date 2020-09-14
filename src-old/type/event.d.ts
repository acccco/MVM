import {arrayT} from "./commom"

export type eventGroup = {
  [eventName: string]: Array<Function> | null;
}

export interface EventInterface {
  id: number
  _event: eventGroup

  $on(eventName: string, fn: arrayT<Function>): this

  $once(eventName: string, fn: Function): this

  $off(eventName: string | undefined, fn?: arrayT<Function>): this

  $emit(eventName: string, args?: Array<any>): this
}
