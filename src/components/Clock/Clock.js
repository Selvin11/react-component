import React, { Component } from 'react'

class Clock extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date()
    }
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.tick()
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  tick() {
    this.setState({
      date: new Date()
    })
  }

  // 属性初始化器语法
  handleClick = (id, e) => {
    console.log('this is:', id)
  }

  render() {
    const numbers = [1,2,3,4,5]
    const listItems = numbers.map((number) => {
      return <li>{number}</li>
    })
    return (
      <div>
        <ul>{listItems}</ul>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        <button onClick={this.handleClick.bind(this, 'id')}>Click test</button>
      </div>
    )
  }
}

export default Clock