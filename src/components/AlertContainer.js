import React, { Component } from 'react';
import './style/AlertContainer.css';
import CN from 'classnames';

import Button from './Button';

import utils from '../lib/utils';

class AlertContainer extends Component {
  constructor(props) {
    super(props);
    this.handleDismissClick = this.handleDismissClick.bind(this);
  }
  static init(self) {
    self.state._alerts = [];
  }
  static clear(self) {
    self.setState({
      _alerts: []
    });
  }
  static addMessage(self, msg) {
    const _msg = {
      id: utils.createId(),
      text: msg.text,
      type: msg.type,
      duration: msg.duration
    };

    self.setState(state => {
      state._alerts.push(_msg);
      return state;
    }, () => {
      if (_msg.duration) {
        _msg._timerId = setTimeout(
          () => self.setState(
            state => {
              state._alerts.splice(state._alerts.indexOf(_msg), 1);
              return state;
            }
          ), msg.duration
        );
      }
    });
  }
  handleDismissClick(msg) {
    this.props.parent.setState(
      state => {
        state._alerts.splice(state._alerts.indexOf(msg), 1);
        if (msg._timerId) {
          clearTimeout(msg._timerId);
        }
        return state;
      }
    );
  }
  static present(self, props) {
    return (
      <AlertContainer parent={self} messages={self.state._alerts} {...props}/>
    );
  }
  render() {
    const messages = this.props.messages;
    let alerts = [];

    for (let i=0; i<messages.length; i++) {
      const msg = messages[i];
      alerts.push(
        <div key={msg.id} className={CN("alert", msg.type)}>
          <Button className="dismiss-button" dataKey={msg}
            onClick={this.handleDismissClick}>
            <i className="fa fa-times fa-1" aria-hidden="true"></i>
          </Button>
          {msg.text}
        </div>
      );
    }

    return (
      <div className={CN("alert-container", this.props.className)}>
        { alerts }
      </div>
    );
  }
}

export default AlertContainer;
