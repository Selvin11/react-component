import React, { Component } from 'react'


class Inner extends Component {

  componentDidMount() {
    console.log(this)
    this.props.methods.testHandle()
  }

  render() {
    return (
      <div>
        <h1>{this.props.hoc}</h1>
        {this.props.children}
      </div>
    )
  }
}

export default Inner