import {Mvm} from './core/instance'
import {initGlobalApi} from "./core/global-api/index"

initGlobalApi(Mvm)

Mvm.version = '0.0.0'

export default Mvm