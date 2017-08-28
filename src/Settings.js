import React, { Component } from 'react';
import './style/Settings.css';

import Form         from './components/Form';
import Input        from './components/Input';
import Button       from './components/Button';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: props.values.login,
      apikey: props.values.apikey
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      login: nextProps.values.login,
      apikey: nextProps.values.apikey,
    });
  }
  handleChange(name, value) {
    this.setState(prevState => {
      prevState[name] = value;
      return prevState;
    });
  }
  handleSubmit() {
    this.props.onSubmit(this.state);
  }
  render() {
    return (
      <div className="Settings">
        <Form onSubmit={this.handleSubmit}>
          <Input type="text" name="login"
            state={this.state} onChange={this.handleChange} />
          <Input type="text" name="apikey"
            state={this.state} onChange={this.handleChange} />
          <Button type="submit">Save</Button>
        </Form>
      </div>
    );
  }
}

export default Settings;
