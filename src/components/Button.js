import React, { Component } from 'react';
import './style/Button.css';

class Button extends Component {
  render() {
    return (
      <button type={this.props.type} onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

export default Button;
