import React, { Component } from 'react';
import './style/Form.css';
import CN from 'classnames';

class Form extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    if (this.props.onSubmit)
      this.props.onSubmit(e);
  }
  render() {
    return (
      <form className={CN("form", this.props.className)}
        action="#" onSubmit={this.handleSubmit}
      >
        {this.props.children}
      </form>
    );
  }
}

export default Form;
