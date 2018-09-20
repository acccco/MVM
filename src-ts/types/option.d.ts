type propArray = Array<string>
type propObj = {
  [propName: string]: {
    type?: null | Object | Function | Boolean | Array<any> | String | Number
    require?: boolean
    default?: any
    [propName: string]: any
  }
}
export type optionPropType = propArray | propObj

type injectArray = Array<string>
type injectObj = {
  [propName: string]: {
    from?: string
    [propName: string]: string
  }
}
export type optionInjectType = injectArray | injectObj

type watchFun = (oldValue: any, newValue: any) => any
type watchObj = {
  handler: watchFun
  deep?: boolean
}
type optionWatch = watchFun | watchObj
export type optionWatchType = optionWatch | Array<optionWatch>

type computedFun = () => any
type computedObj = {
  get: computedFun
  set: () => any
}
export type optionComputedType = computedFun | computedObj

type lifeCycleFun = () => any
type optionLifeCycleType = lifeCycleFun | Array<lifeCycleFun>

export type optionType = {
  data?: () => object
  prop?: optionPropType
  inject?: optionInjectType
  provide?: Object | (() => Object)
  watch?: {
    [propName: string]: optionWatchType
  }
  computed?: {
    [propName: string]: optionComputedType
  }
  method?: {
    [propName: string]: () => any
  }
  beforeCreate?: optionLifeCycleType
  created?: optionLifeCycleType
  beforeDestroy?: optionLifeCycleType
  destroyed?: optionLifeCycleType
  mixin?: Array<optionType>
  [propName: string]: any
}

export type afterMergeOptionType = {
  data?: () => object
  prop?: propObj
  inject?: injectObj
  watch?: {
    [propName: string]: Array<watchObj>
  }
  computed?: {
    [propName: string]: computedObj
  }
  method?: {
    [propName: string]: () => any
  }
  beforeCreate?: Array<lifeCycleFun>
  created?: Array<lifeCycleFun>
  beforeDestroy?: Array<lifeCycleFun>
  destroyed?: Array<lifeCycleFun>
  mixin?: Array<optionType>
  [propName: string]: any
}
