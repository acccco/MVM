import RD from '../../src/index'
import TodoTask from './TodoTask'
import NoTask from './NoTask'

export default new RD({
  render(h) {
    console.log('app render')
    let todoList = this.todoList.map((item) =>
      <TodoTask key={item.id}
                task={item}/>
    )
    if (todoList.length === 0) {
      todoList = <NoTask key="nt"/>
    }
    return (
      <div className='todo-wrap'>
        <p className='title'>{this.title}</p>
        <div className='item-wrap'>
          {todoList}
        </div>
        <div className='item-wrap row'>
          <input className='input' type='text'
                 placeholder='记点什么'
                 value={this.inputValue}
                 oninput={(e) => {
                   this.inputValue = e.target.value
                 }}/>
          <div className='save' onclick={this.addTodo.bind(this)}>保存</div>
        </div>
      </div>
    )
  },
  created() {
    this.$on('removeById', (id) => {
      for (let i = 0, len = this.todoList.length; i < len; i++) {
        if (this.todoList[i].id === id) {
          this.todoList.splice(i, 1)
          return
        }
      }
    })
    this.$on('toggleTaskType', (task) => {
      for (let i = 0, len = this.todoList.length; i < len; i++) {
        if (this.todoList[i].id === task.id) {
          this.todoList[i].complete = !task.complete
          return
        }
      }
    })
  },
  data() {
    return {
      title: 'RD with jsx TodoList',
      todoList: [],
      inputValue: ''
    }
  },
  method: {
    addTodo() {
      this.todoList.unshift({
        id: this.todoList.length,
        complete: false,
        taskName: this.inputValue
      })
      this.inputValue = ''
    }
  }
})
