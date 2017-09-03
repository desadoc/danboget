import React, { Component } from 'react';
import './style/TextArea.css';
import CN from 'classnames';

class TextArea extends Component {
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
      <textarea
        id={this.props.id}
        className={CN("text-area", this.props.className)}
        name={this.props.name}
        onChange={this.handleChange}
        value={this.props.value}
      />
    );
  }
}

export default TextArea;
