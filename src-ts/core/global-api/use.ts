import {classRD} from "../../types/rd"

export function initUse(
  RD: classRD
) {
  RD.use = function (
    plugin: any, ...args: Array<any>
  ) {
    // 保存已生效的插件
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // plugin.install 绑定执行函数的上下文环境
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
