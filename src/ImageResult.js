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

    const externalLinkBtn = 
        <Button className='search-results-item-details'
          onClick={(_, e) => {
            e.stopPropagation();
            window.open(post.complete_post_url);
          }}
        >
          <i className='fa fa-external-link fa-1' aria-hidden='true'></i>
        </Button>;

    return (
      <div onClick={(e) => this.props.onDetailsClick(this.props.dataKey, e)}
        dataKey={this.props.dataKey}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        className={CN('search-results-item', this.props.className)}
      >
        <Image alt={danbooru.resumeTagString(post)}
              src={post.complete_preview_url} />
        {externalLinkBtn}
      </div>
    );
  }
}

export default ImageResult;
