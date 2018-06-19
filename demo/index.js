import RD from '../src/index'
import jsxPlugin from './jsxPlugin/index'
import App from './component/app'
import './index.scss'

RD.use(jsxPlugin, RD)

let app = new RD(App)
window.rd = app

RD.$mount(document.getElementById('app'), app)