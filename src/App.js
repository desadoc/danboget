import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import './style/App.css';

import Search from './Search';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='app'>
          <Route exact path='/' render={(props) => <Redirect to='/welcome' />} />
          <Route exact path='/welcome' render={
            (props) => <Redirect to='/search?limit=100&filters=super_safe' />
          } />
          <Route exact path='/search' component={Search} />
        </div>
      </Router>
    );
  }
}

export default App;
