export type commonObject = {
  [propName: string]: any
}

export type objOrArray = {
  [index: number]: any
  [propName: string]: any
}

export type arrayT<T> = Array<T> | T
