export default {
  render(h) {
    return (
      <div className='item-wrap row'>
        <p>{this.inputValue}</p>
        <input className='input' type='text'
               placeholder={this.placeholder}
               value={this.inputValue}
               oninput={(e) => {
                 this.inputValue = e.target.value
               }}/>
        <div className='save' onclick={this.save}>保存</div>
      </div>
    )
  },
  prop: ['placeholder'],
  data() {
    return {
      inputValue: '',
      noTaskInfo: 'test'
    }
  },
  method: {
    save() {
      this.$emit('addTodo', this.inputValue)
      this.inputValue = ''
    }
  },
  created() {
    console.log('input created')
  },
  destroyed() {
    console.log('input destroyed')
  }
}
