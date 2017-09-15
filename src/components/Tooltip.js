import React, { Component } from 'react';
import './style/Tooltip.css';

class Tooltip extends Component {
  render() {
    return (
      <span className="tooltip" title={this.props.text}>
        <i className="fa fa-question-circle-o fa-1" aria-hidden="true"></i>
      </span>
    );
  }
}

export default Tooltip;
