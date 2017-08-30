import React, { Component } from 'react';
import './style/Settings.css';

import Form   from './components/Form';
import Input  from './components/Input';
import Label  from './components/Label';
import Button from './components/Button';

import utils from './lib/utils';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: {
        id: utils.createId(),
        value: props.values.login
      },
      apikey: {
        id: utils.createId(),
        value: props.values.apikey
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState(prevState => {
      prevState.login.value = nextProps.values.login;
      prevState.login.apikey = nextProps.values.apikey;
      return prevState;
    });
  }
  handleChange(name, value) {
    this.setState(prevState => {
      prevState[name].value = value;
      return prevState;
    });
  }
  handleSubmit() {
    this.props.onSubmit({
      login: this.state.login.value,
      apikey: this.state.apikey.value,
    });
  }
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <div className="settings">
          <div className="form-row">
            <div className="input-group">
              <Label htmlFor={this.state.login.id}>Login:</Label>
              <Input id={this.state.login.id} type="text" name="login" label="Login:"
                value={this.state.login.value} onChange={this.handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="input-group">
              <Label htmlFor={this.state.apikey.id}>Apikey:</Label>
              <Input id={this.state.apikey.id} type="text" name="apikey" label="Apikey:"
                value={this.state.apikey.value} onChange={this.handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="input-group">
              <Button type="submit">Save</Button>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

export default Settings;
