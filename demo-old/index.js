import RD from '../src/index'
import jsxPlugin from './plugin/index'
import App from './component/App'
import './index.scss'

RD.use(jsxPlugin, RD)

RD.$mount(document.getElementById('app'), new RD(App))
