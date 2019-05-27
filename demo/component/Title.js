export default {
  render(h) {
    return (
      <p className='title'>{this.title}</p>
    )
  },
  prop: ['title'],
  created() {
    console.log('title created')
  },
  destroyed() {
    console.log('title destroyed')
  }
}
