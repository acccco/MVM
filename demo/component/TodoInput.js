export default {
  render(h) {
    return (
      <div className='item-wrap row'>
        <input className='input' type='text'
               placeholder={this.placeholder}
               value={this.inputValue}
               onInput={(e) => {
                 this.inputValue = e.target.value
               }}/>
        <div className='save' onClick={this.save}>保存</div>
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
}
