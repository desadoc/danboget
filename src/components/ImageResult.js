import React, { Component } from 'react';
import './style/ImageResult.css';

class ImageResult extends Component {
  render() {
    return (
      <img src={this.props.src} alt="probably boobs or smth dunno"/>
    );
  }
}

export default ImageResult;
