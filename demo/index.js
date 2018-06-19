import RD from '../src/index'
import jsxPlugin from './jsxPlugin/index'
import App from './component/app'
import './index.scss'

RD.use(jsxPlugin, RD)

window.rd = App

RD.$mount(document.getElementById('app'), App)