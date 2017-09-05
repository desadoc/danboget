import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './style/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const AppWRouter =
  (props) => <Router><Route component={App} /></Router>;

ReactDOM.render(<AppWRouter />, document.getElementById('root'));
registerServiceWorker();
