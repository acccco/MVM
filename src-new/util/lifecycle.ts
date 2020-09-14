import ReactiveData from "../";

export const LIFECYCLE_HOOK: Array<string> = [
  "beforeCreate",
  "created",
  "beforeDestroy",
  "destroyed",
];

export function callHook(rd: ReactiveData, hookName: string) {
  const handler = rd.$option[hookName];
  if (handler) {
    for (let i = 0, j = handler.length; i < j; i++) {
      handler[i].call(rd);
    }
  }
  rd.emit("hook:" + hookName);
}
