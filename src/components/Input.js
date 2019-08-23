import React, { Component } from 'react';
import './style/Input.css';
import CN from 'classnames';

class Input extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    if (this.props.onChange)
      this.props.onChange(e.target.value, this.props.dataKey, e);
  }
  render() {
    return (
      <input
        id={this.props.id} className={CN('input', this.props.className)}
        type={this.props.type} name={this.props.name} value={this.props.value}
        onChange={this.handleChange} style={this.props.style}/>
    );
  }
}

export default Input;
