import RD from '../src/index'
import jsxPlugin from './jsxPlugin/index'
import App from './component/App'
import './index.scss'

RD.use(jsxPlugin, RD)

console.log(App)

RD.$mount(document.getElementById('app'), App)
