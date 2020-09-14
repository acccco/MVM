import Watcher from "../core/watcher";

const queue: Array<Watcher> = [];
let has: {
  [key: string]: any;
} = {};
// 是否在更新
let flushing: boolean = false;
// 是否在等待更新
let waiting: boolean = false;
// 目前正在执行的 Watcher 的 ID
let index: number = 0;

export default function watcherQueue(watcher: Watcher) {
  const id: number = watcher.id;
  if (!has[id]) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // 将该 watcher 添加到对应位置，按 id 的顺序执行
      let i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // 执行队列
    if (!waiting) {
      waiting = true;
      flushSchedulerQueue();
    }
  }
}

function flushSchedulerQueue() {
  flushing = true;
  let watcher: Watcher, id: number;

  // 根据 ID 顺序的执行，原因如下
  // 1. 组件的更新顺序是从父组件到子组件的，因为父组件都比子组件先创建
  // 2. 当一个组件的父组件运行 watcher 时，可能会被销毁，而销毁的 watchers 是不需要执行的
  queue.sort((a, b) => a.id - b.id);

  // 当依次执行队列中的 watcher 时，不应该缓存数组长度，因为当队列执行时，可能会有 watcher 加入进来
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
  }

  resetState();
}

function resetState() {
  index = queue.length = 0;
  has = {};
  waiting = flushing = false;
}
