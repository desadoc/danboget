import React, { Component } from 'react';
import './style/ImageResult.css';
import CN from 'classnames';

import Image from './components/Image';
import Button from './components/Button';

import danbooru from './lib/danbooru';

class ImageResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseOver: false
    }

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }
  handleMouseEnter() {
    this.setState({ mouseOver: true });
  }
  handleMouseLeave() {
    this.setState({ mouseOver: false });
  }
  render() {
    let post = this.props.post;

    return (
      <div onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        className={CN('search-results-item', this.props.className)}>
        <a target='_blank' href={post.complete_post_url}>
          <div className='search-results-item-image'>
            <Image alt={danbooru.resumeTagString(post)}
              src={post.complete_preview_url} />
          </div>
        </a>
        { this.state.mouseOver &&
          <Button className='search-results-item-details'
            dataKey={this.props.dataKey} onClick={this.props.onDetailsClick}>
            <i className='fa fa-search-plus fa-1' aria-hidden='true'></i>
          </Button>
        }
      </div>
    );
  }
}

export default ImageResult;
