import React, { Component } from 'react';
import './style/Video.css';

class Video extends Component {
  render() {
    return (
      <video className="video" autoPlay loop controls src={this.props.src} />
    );
  }
}

export default Video;
