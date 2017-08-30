import React, { Component } from 'react';
import './style/SearchResults.css';
import CN from 'classnames';

import Image  from './components/Image';

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

    let altString = function(post) {
      let tagString = '';

      if (post.tag_string_artist)
        tagString += post.tag_string_artist + ' ';

      if (post.tag_string_copyright)
        tagString += post.tag_string_copyright + ' ';

      if (post.tag_string_character)
        tagString += post.tag_string_character + ' ';

      if (post.tag_string_general)
        tagString += post.tag_string_general;

      if (tagString.length > 150)
        tagString = tagString.substr(0, 147) + "...";

      return tagString;
    }

    if (posts.length > 0) {
      for (let i=0; i<posts.length; i++) {
        let post = posts[i];

        let statusClasses = {
          parent: post.has_children,
          child: post.parent_id,
          pending: post.is_pending,
          deleted: post.is_deleted
        };

        postsEls.push(
          <a target="_blank" href={post.complete_post_url}
            className={CN("search-results-items", "item", statusClasses)}
          >
            <div className="search-results-item-image">
              <Image alt={altString(post)}
                key={post.id} src={post.complete_preview_url} />
            </div>
          </a>
        );
      }
    }

    return (
      <div className="search-results">
        <div className="search-results-items">
          { postsEls }
        </div>
      </div>
    );
  }
}

export default SearchResults;
