import React, { Component } from 'react';
import './style/Modal.css';
import CN from 'classnames';

import Button from './Button';

class Modal extends Component {
  render() {
    return (
      <div className={CN("modal", this.props.className)}>
        <div className="modal-overlay">
          <div className="modal-panel">
            {this.props.children}
            <Button className="dismiss-button"
              type="button" onClick={this.props.onExitClick}>
              <i className="fa fa-times fa-1" aria-hidden="true"></i>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
