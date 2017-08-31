import React, { Component } from 'react';
import './style/SearchResults.css';
import CN from 'classnames';

import Image  from './components/Image';

let danbo = require('./lib/danbooru');

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: []
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
    let filters = props.filters;
    let limit = props.limit;
    let page = props.page;

    if (query == null) {
      this.setState({
        results: []
      });
      return;
    }

    let queries = query.match(/[^\r\n]+/g);
    if (queries == null) {
      queries = [''];
    }

    danbo.posts({
      login: login,
      apikey: apikey,
      queries: queries,
      filters: filters,
      quantity: limit,
      offset: page * limit
    })
    .then(res => {
      this.setState({
        results: res
      });
    })
    .catch(err => {
      console.log(err);
    })
  }
  render() {
    let resultsEls = [];
    let results = this.state.results;

    for (let i=0; i<results.length; i++) {
      let result = results[i];

      let query = result.query;
      let posts = result.posts;

      let postsEls = [];

      for (let j=0; j<posts.length; j++) {
        let post = posts[j];

        let statusClasses = {
          parent: post.has_children,
          child: post.parent_id,
          pending: post.is_pending,
          deleted: post.is_deleted
        };

        postsEls.push(
          <a key={post.id} target="_blank" href={post.complete_post_url}
            className={CN("item", statusClasses)}
          >
            <div className="search-results-item-image">
              <Image alt={danbo.resumeTagString(post)}
                key={post.id} src={post.complete_preview_url} />
            </div>
          </a>
        );
      }

      resultsEls.push(
        <div className="search-results-group">
          <div className="search-results-group-title">
            <p>{ query }</p>
          </div>
          {
            (postsEls.length > 0) ?
            <div className="search-results-items">
              { postsEls }
            </div> :
            <div className="search-results-items empty">
              No results
            </div>
          }
        </div>
      );
    }

    return (
      <div className="search-results">
        { resultsEls }
      </div>
    );
  }
}

export default SearchResults;
