import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import './style/App.css';

import SideBar      from './SideBar';
import Search       from './Search';
import Settings     from './Settings';

let defaultAliases = [
  {
    name: 'safe',
    tags: 'rating:s -ass -breasts -panties -bra'
  },
  {
    name: 'super_safe',
    tags: 'rating:s -ass -bikini -bra -breasts -legs -midriff -nude ' +
          '-panties -pantyhose -swimsuit -thighhighs'
  }
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: {
        login: '',
        apikey: '',
        tagAliases: []
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

    let fromStorage = JSON.parse(values);

    let login = fromStorage.login || '';
    let apikey = fromStorage.apikey || '';
    let tagAliases = fromStorage.tagAliases;

    if (tagAliases.length === 0) {
      tagAliases = defaultAliases;
    }

    this.setState({
      settings: {
        login: login,
        apikey: apikey,
        tagAliases: tagAliases
      }
    });
  }
  handleSettingsSubmit(values) {
    if (values.tagAliases.length === 0) {
      values.tagAliases = defaultAliases;
    }

    this.setState({
      settings: values
    });

    this.localStorage.setItem("settings", JSON.stringify(values));
  }
  render() {
    let settings = this.state.settings;

    let SearchWProps = (props) =>
      <Search login={settings.login} apikey={settings.apikey}
        tagAliases={settings.tagAliases} {...props} />;
    let SettingsWProps = (props) =>
      <Settings values={settings} onSubmit={this.handleSettingsSubmit} />;

    return (
      <Router>
        <div className="app">
          <div className="root-container">
            <SideBar />
            <Route exact path="/" render={
              (props) => <Redirect to="/search" />
            } />
            <Route exact path="/search" render={SearchWProps} />
            <Route exact path="/settings" render={SettingsWProps} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
