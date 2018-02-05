import React, { Component } from 'react'

export function Hoc(InnerComponent) {
  return class HocWrap extends Component {
    constructor(props) {
      super(props)
      this.state = {
        hoc: 'parent hoc'
      }
    }

    componentDidMount() {
      console.log(this)
    }
  
    render() {
      const methods = {
        testHandle: function() {
          console.log('testHandle')
        }
      }
      return (
        <InnerComponent {...this.props} {...this.state} methods={methods}/>
      )
    }
  }
}
