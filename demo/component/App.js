import TodoTask from './TodoTask'
import NoTask from './NoTask'
import Title from './Title'
import TodoInput from './TodoInput'

export default {
  render(h) {
    let todoList = this.todoList.map((item) =>
      <TodoTask on-removeById on-toggleTaskType task={item}/>
    )
    if (todoList.length === 0) {
      todoList = <NoTask noTaskInfo={this.noTaskInfo}/>
    }
    return (
      <div className='todo-wrap'>
        <Title title={this.title}/>
        <div className='item-wrap'>
          {todoList}
        </div>
        <TodoInput on-addTodo placeholder={'记点什么'}/>
      </div>
    )
  },
  method: {
    removeById(id) {
      for (let i = 0, len = this.todoList.length; i < len; i++) {
        if (this.todoList[i].id === id) {
          this.todoList.splice(i, 1)
          return
        }
      }
    },
    addTodo(name) {
      console.log(name)
      this.todoList.unshift({
        id: this.todoList.length,
        complete: false,
        taskName: name
      })
    },
    toggleTaskType(task) {
      for (let i = 0, len = this.todoList.length; i < len; i++) {
        if (this.todoList[i].id === task.id) {
          this.todoList[i].complete = !task.complete
          console.log('1234123')
          return
        }
      }
    }
  },
  data() {
    return {
      title: 'RD with jsx TodoList',
      todoList: [],
      noTaskInfo: '暂无 TodoList',
    }
  },
  created() {
    console.log('app created')
  },
  destroyed() {
    console.log('app destroyed')
  }
}
