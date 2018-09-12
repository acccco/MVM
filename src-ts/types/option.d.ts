type watchFun = (oldValue: any, newValue: any) => any
type watchObj = {
  handler: watchFun
  deep?: boolean
}

type computedFun = () => any
type computedObj = {
  get: computedFun
  set: () => any
}

type lifeCycleFun = () => any
type lifeCycleType = lifeCycleFun | Array<lifeCycleFun>


export type optionType = {
  data?: () => void
  watch?: {
    [propName: string]: watchFun | watchObj
  }
  computed?: {
    [propName: string]: computedFun | computedObj
  }
  method?: {
    [propName: string]: () => any
  }
  beforeCreate?: lifeCycleType
  created?: lifeCycleType
  beforeDestroy?: lifeCycleType
  destroyed?: lifeCycleType
  mixin?: optionType
}
