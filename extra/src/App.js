import React, { Component } from 'react';
import './App.css';
import { BrowserRouter} from "react-router-dom";
import Layout from './components/Layout/Layout';
class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter >
       <Layout />
       </BrowserRouter>
      </div>
    );
  }
}

export default App;
