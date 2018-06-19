let NoTask = {
  render(h) {
    console.log('no task render')
    return (
      <div className="no-task">{this.noTaskInfo}</div>
    )
  },
  prop: ['noTaskInfo']
}

export default NoTask