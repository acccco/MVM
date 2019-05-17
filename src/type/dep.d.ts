export interface DepInterface {
  id: number
  monitor: {
    object: Object
    key: string
  }
  subs: Array<any>

  addSub(sub: any): void

  removeSub(sub: any): void

  notify(): void
}
