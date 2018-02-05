import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Tabs } from './components/Tab/Tab'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Tabs tabs={[
          { key: 't1', title: 't1' },
          { key: 't2', title: 't2' },
          { key: 't3', title: 't3' },
          { key: 't4', title: 't4' },
        ]} initialPage={'t2'}
        >
          <div key="t1"><p>content1</p></div>
          <div key="t2"><p>content2</p></div>
          <div key="t3"><p>content3</p></div>
          <div key="t4"><p>content4</p></div>
        </Tabs>
      </div>
    );
  }
}

export default App;
