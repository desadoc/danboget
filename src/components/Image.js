import React, { Component } from 'react';
import './style/Image.css';

class Image extends Component {
  render() {
    return (
      <img src={this.props.src} alt={this.props.alt}/>
    );
  }
}

export default Image;
