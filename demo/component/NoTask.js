export default {
  render(h) {
    return (
      <div className="no-task">{this.noTaskInfo}</div>
    )
  },
  prop: ['noTaskInfo']
}
