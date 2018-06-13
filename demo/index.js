import RD from '../src/index'
import jsxPlugin from './jsxPlugin/index'
import App from './component/app'
import './index.scss'

RD.use(jsxPlugin, RD)
console.log(App)
window.rd = App

App.$mount(document.getElementById('app'))