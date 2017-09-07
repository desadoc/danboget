import React, { Component } from 'react';
import './style/Image.css';
import CN from 'classnames';

class Image extends Component {
  render() {
    return (
      <img className={CN("image", this.props.className)}
        src={this.props.src} alt={this.props.alt}/>
    );
  }
}

export default Image;
