import createElement from '../jsxPlugin/createElement'
import RD from '../../src/index'

let noTask = RD.extend({
  render() {
    return (
      <div className="no-task">暂无 TodoList</div>
    )
  }
})

export default noTask