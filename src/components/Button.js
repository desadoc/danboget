import React, { Component } from 'react';
import './style/Button.css';
import CN from 'classnames';

class Button extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    if (this.props.onClick)
      this.props.onClick(this.props.dataKey, e);
  }
  render() {
    return (
      <button type={this.props.type}
        className={CN("button", this.props.className)}
        onClick={this.handleClick}
      >
        {this.props.children}
      </button>
    );
  }
}

export default Button;
