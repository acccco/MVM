import RD from '../src/index'
import jsxPlugin from './jsxPlugin/index'
import App from './component/App'
import './index.scss'

RD.use(jsxPlugin, RD)

RD.$mount(document.getElementById('app'), App)