import {watcherCallback, watcherOption} from "./watcher"
import {computedHandle} from "./computed"
import {arrayT, commonObject} from "./commom"

export type injectOption = {
  [injectName: string]: {
    from?: string
    default?: string
  }
}

export type propOption = {
  [propName: string]: {
    type?: null | Object | Function | Boolean | Array<any> | String | Number
    require?: boolean
    default?: any
  }
}

type lifeCycleFun = () => any

export type watcherObject = {
  callback: watcherCallback
  option: watcherOption
}

export type watchOption = {
  [watcherName: string]: Array<watcherObject>
}

export type userWatchOption = {
  [watcherName: string]: arrayT<watcherCallback | watcherObject>
}

export type computedOption = {
  [computedName: string]: computedHandle
}

export type userComputedOption = {
  [computedName: string]: computedHandle | Function
}

export type optionType = {
  inject?: injectOption
  propData?: commonObject
  prop?: propOption
  data?: () => object
  computed?: computedOption
  provide?: () => object
  method?: {
    [propName: string]: () => any
  }
  watch?: watchOption
  beforeCreate?: Array<lifeCycleFun>
  created?: Array<lifeCycleFun>
  beforeDestroy?: Array<lifeCycleFun>
  destroyed?: Array<lifeCycleFun>
  mixin?: Array<optionType>
  [name: string]: any
}

export type userOptionType = {
  inject?: Array<string> | injectOption
  prop?: Array<string> | propOption
  data?: () => object
  computed?: userComputedOption
  provide?: () => object | object
  method?: {
    [propName: string]: () => any
  }
  watch?: userWatchOption
  beforeCreate?: Array<lifeCycleFun>
  created?: Array<lifeCycleFun>
  beforeDestroy?: Array<lifeCycleFun>
  destroyed?: Array<lifeCycleFun>
  mixin?: Array<userOptionType>
  [name: string]: any
}
