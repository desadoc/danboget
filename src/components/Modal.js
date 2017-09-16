import React, { Component } from 'react';
import './style/Modal.css';
import CN from 'classnames';

import Button from './Button';

class Modal extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    if (!this.props.onExitClick)
      return;
    if (!e.target.classList.contains('modal-overlay'))
      return;
    this.props.onExitClick();
  }
  render() {
    return (
      <div className={CN('modal', this.props.className)}>
        <div className='modal-overlay' onClick={this.handleClick}>
          <div className='modal-panel'>
            {this.props.children}
            <Button className='dismiss-button'
              onClick={this.props.onExitClick}>
              <i className='fa fa-times fa-1' aria-hidden='true'></i>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
