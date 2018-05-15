export function initUse(MVM) {
    MVM.use = function (plugin, ...args) {
        // 保存已生效的插件
        const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
        if (installedPlugins.indexOf(plugin) > -1) {
            return this
        }

        // plugin.install 是一个函数的话说明 plugin 为一个对象，则将需要的上下文环境传入
        if (typeof plugin.install === 'function') {
            plugin.install.apply(plugin, args)
        } else if (typeof plugin === 'function') {
            plugin.apply(null, args)
        }
        installedPlugins.push(plugin)
        return this

    }
}