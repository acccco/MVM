export default {
  render(h) {
    return (
      <div className='row todo-item'>
        <div className='col-1 row'>
          <input type='checkbox' checked={this.task.complete}
                 onchange={this.change}/>
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
    change() {
      this.$emit('toggleTaskType', this.task)
    },
    remove(id) {
      this.$emit('removeById', id)
    }
  },
  created() {
    console.log('todo created')
  },
  destroyed() {
    console.log('todo destroyed')
  }
}
