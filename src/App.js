import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import './style/App.css';

import TopMenu      from './TopMenu';
import Search       from './Search';
import Settings     from './Settings';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: {
        login: '',
        apikey: ''
      }
    };

    this.localStorage = window.localStorage;

    this.handleSettingsSubmit = this.handleSettingsSubmit.bind(this);
  }
  componentDidMount() {
    let values = this.localStorage.getItem("settings");
    if (!values) {
      return;
    }

    this.setState({
      settings: JSON.parse(values)
    });
  }
  handleSettingsSubmit(values) {
    this.setState({
      settings: values
    });

    this.localStorage.setItem("settings", JSON.stringify(values));
  }
  render() {
    let settings = this.state.settings;

    let SearchWProps = (props) =>
      <Search login={settings.login} apikey={settings.apikey} {...props} />;
    let SettingsWProps = (props) =>
      <Settings values={settings} onSubmit={this.handleSettingsSubmit} />;

    return (
      <Router>
        <div className="App">
          <TopMenu />
          <Route exact path="/" render={
            (props) => <Redirect to="/search" />
          } />
          <Route exact path="/search" render={SearchWProps} />
          <Route exact path="/settings" render={SettingsWProps} />
        </div>
      </Router>
    );
  }
}

export default App;
