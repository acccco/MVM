export default {
  render(h) {
    return (
      <div className="no-task">{this.noTaskInfo}</div>
    )
  },
  prop: ['noTaskInfo'],
  created() {
    console.log('no task created')
  },
  destroyed() {
    console.log('no task destroyed')
  }
}
