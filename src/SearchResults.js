import React, { Component } from 'react';
import './style/SearchResults.css';

import ImageResult  from './components/ImageResult';
import Button       from './components/Button';

let danbooru = require('./lib/danbooru');

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: []
    }
  }
  componentDidMount() {
    this.fetchPosts(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.fetchPosts(nextProps);
  }
  fetchPosts(props) {
    let login = props.login;
    let apikey = props.apikey;
    let query = props.query;
    let limit = props.limit;
    let page = props.page;

    if (query == null) {
      this.setState({
        posts: []
      });
      return;
    }

    danbooru.posts({
      login: login,
      apikey: apikey,
      tags: query,
      quantity: limit,
      offset: page * limit
    })
    .then(res => {
      this.setState({
        posts: res
      });
    })
    .catch(err => {
      console.log(err);
    })
  }
  render() {
    let postsEls = [];
    let posts = this.state.posts;

    if (posts.length > 0) {
      for (let i=0; i<posts.length; i++) {
        let post = posts[i];
        postsEls.push(
          <a target="_blank" href={post.complete_post_url}>
            <ImageResult key={post.id} src={post.complete_preview_url} />
          </a>
        );
      }
    }

    return (
      <div className="SearchResults">
        {postsEls}
        { (this.props.query != null) &&
            <Button onClick={this.props.onNextPageClick}>Next Page</Button> }
      </div>
    );
  }
}

export default SearchResults;
