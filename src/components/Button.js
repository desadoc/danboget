import React, { Component } from 'react';
import './style/Button.css';
import CN from 'classnames';

class Button extends Component {
  render() {
    return (
      <button className={CN("button", this.props.className)}
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}

export default Button;
