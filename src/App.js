import React, { Component } from 'react';
import { ReactP5Wrapper } from '@p5-wrapper/react';
import sketch from './sketches/platformer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="App">
          <ReactP5Wrapper sketch={sketch} />
        </div>
      </div>
    );
  }
}

export default App;