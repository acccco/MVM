import createElement from '../vNode/createElement'
import RD from '../../../src/index'

/** @jsx createElement */

let TodoTask = RD.extend({
  render() {
    return (
      <div className='row todo-item'>
        <div className='col-1 row'>
          <input type='checkbox' checked={this.cancelWatch('task.complete')}
                 onchange={this.change.bind(this, this.task)}/>
        </div>
        <div className={this.task.complete ? 'col-2 on' : 'col-2'}>{this.task.taskName}</div>
        <div className='col-3'>
          <span className='btn' onclick={this.remove.bind(this, this.task.id)}>删除</span>
        </div>
      </div>
    )
  },
  prop: {
    task: {
      type: Object,
      require: true,
      default() {
        return {}
      }
    }
  },
  method: {
    change(task) {
      this.$emit('toggleTaskType', task)
    },
    remove(id) {
      this.$emit('removeById', id)
    }
  }
})

export default TodoTask