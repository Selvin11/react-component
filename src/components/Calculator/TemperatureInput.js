import React, { Component } from 'react'

const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
}

class TemperatureInput extends Component {
  
  // 属性初始化器语法
  handleChange = e => {
    this.props.onTemperatureChange(e.target.value)
  }

  render() {
    const temperature = this.props.temperature
    const scale = this.props.scale
    return (
      <fieldset>
        <legend>输入一个{scaleNames[scale]}温度</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
      </fieldset>
    )
  }
}

export default TemperatureInput