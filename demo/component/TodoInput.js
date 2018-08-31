import RD from '../../src/index'

export default RD.extend({
  render(h) {
    return (
      <div className='item-wrap row'>
        <input className='input' type='text'
               placeholder={this.placeholder}
               value={this.inputValue}
               oninput={(e) => {
                 this.inputValue = e.target.value
               }}/>
        <div className='save' onclick={this.save.bind(this)}>保存</div>
      </div>
    )
  },
  prop: ['placeholder'],
  data() {
    return {
      inputValue: ''
    }
  },
  method: {
    save() {
      this.$emit('addTodo', this.inputValue)
      this.inputValue = ''
    }
  }
})
