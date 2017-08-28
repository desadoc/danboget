import React, { Component } from 'react';
import './style/Input.css';

class Input extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.props.onChange(this.props.name, e.target.value);
  }
  render() {
    return (
      <input type={this.props.type}
        name={this.props.name}
        value={this.props.state[this.props.name]}
        onChange={this.handleChange}
      />
    );
  }
}

export default Input;
