import RD from '../../src/index'

let noTask = RD.extend({
  render(h) {
    console.log('no task render')
    return (
      <div className="no-task">{this.info}</div>
    )
  },
  data() {
    return {
      info: '暂无 TodoList'
    }
  }
})

export default noTask