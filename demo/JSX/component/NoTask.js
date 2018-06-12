import createElement from '../vNode/createElement'
import RD from '../../../src/index'

/** @jsx createElement */

let noTask = RD.extend({
  render() {
    return (
      <div className="no-task">暂无 TodoList</div>
    )
  }
})

export default noTask