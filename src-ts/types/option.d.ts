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
