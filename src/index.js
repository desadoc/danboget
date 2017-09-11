import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import './style/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const AppWRouter =
  (props) =>
    <Router>
      <div className="router-root">
        <Route exact path="/" render={(props) => <Redirect to="/welcome" />} />
        <Route exact path="/welcome" render={
          (props) => <Redirect to="/search?limit=100&filters=super_safe" />
        } />
        <Route exact path="/search" component={App} />
      </div>
    </Router>;

ReactDOM.render(<AppWRouter />, document.getElementById('root'));
registerServiceWorker();
