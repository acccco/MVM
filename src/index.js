import {RD} from './core/instance'
import {initGlobalApi} from './core/global-api/index'

// 初始化 RD 下的类方法
initGlobalApi(RD)

RD.version = '0.0.0'

export default RD