import RD from '../../src/index'

export default RD.extend({
  render(h) {
    return (
      <p className='title'>{this.title}</p>
    )
  },
  prop: ['title']
})
