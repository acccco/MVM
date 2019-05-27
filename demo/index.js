import RD from '../src/index'
import jsxPlugin from './plugin/index'
import App from './component/App'
import './index.scss'

RD.use(jsxPlugin, RD)

window.app = new RD(App)

RD.$mount(document.getElementById('app'), window.app)
