import React, { Component } from 'react';
import './style/SearchResults.css';
import CN from 'classnames';

import Image  from './components/Image';
import Button  from './components/Button';
import Modal  from './components/Modal';

import ImageResult from './ImageResult';
import SearchNav from './SearchNav';

let danbo = require('./lib/danbooru');

function expandAliases(query, aliasesMap) {
  let queryTags = query.split(' ');
  for (let i=0; i<queryTags.length; i++) {
    let queryTag = queryTags[i];
    let definition = aliasesMap[queryTag];
    if (definition != null) {
      queryTags[i] = definition;
    }
  }
  return queryTags.reduce(function(a, b) {
    if (a) return a + ' ' + b;
    return b;
  }, '');
}

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: []
    }

    this.handleDetailsClick = this.handleDetailsClick.bind(this);
    this.handleSlideshowClick = this.handleSlideshowClick.bind(this);
    this.handlePreviewExit = this.handlePreviewExit.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
  }
  componentDidMount() {
    this.fetchPosts(this.props);
  }
  componentWillReceiveProps(nextProps) {
    let fetch = false;

    for (let key in nextProps) {
      if (!nextProps.hasOwnProperty(key))
        continue;

      if (key === "slideshowInterval")
        continue;

      if (this.props[key] !== nextProps[key]) {
        fetch = true;
        break;
      }
    }

    if (!fetch) return;

    this.setState({
      modalPreview: null
    }, () => this.fetchPosts(nextProps));
  }
  handleDetailsClick(params) {
    this.setState({
      modalPreview: params
    });
  }
  handleSlideshowClick() {
    if (this.state.slideshowTimer) {
      clearInterval(this.state.slideshowTimer);
      this.setState({ slideshowTimer: null });
    } else {
      let timerId = setInterval(() => {
        this.setState(state => {
          let postIndex = state.modalPreview.postIndex;
          let groupIndex = state.modalPreview.groupIndex;

          postIndex++;
          if (postIndex >= state.results[groupIndex].posts.length) {
            postIndex = 0;
            groupIndex++;

            if (groupIndex >= state.results.length) {
              clearInterval(this.state.slideshowTimer);
              state.modalPreview = null;
              state.slideshowTimer = null;
              return state;
            }
          }

          state.modalPreview = { postIndex, groupIndex };
          return state;
        });
      }, this.props.slideshowInterval * 1000);
      this.setState({ slideshowTimer: timerId });
    }
  }
  handlePreviewExit() {
    this.setState(state => {
      if (state.slideshowTimer) {
        clearInterval(state.slideshowTimer);
        state.slideshowTimer = null;
      }

      state.modalPreview = null;
      return state;
    })
  }
  handleRefreshClick() {
    this.fetchPosts(this.props);
  }
  fetchPosts(props) {
    let login = props.login;
    let apikey = props.apikey;
    let tagAliases = props.tagAliases;
    let query = props.query;
    let extra = props.extra;
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

    let tagAliasesMap = {};
    for (let i=0; i<tagAliases.length; i++) {
      tagAliasesMap[tagAliases[i].name] = tagAliases[i].tags;
    }

    let solvedQueries = [];
    for (let i=0; i<queries.length; i++) {
      solvedQueries.push(
        expandAliases(queries[i], tagAliasesMap)
      );
    }

    if (this.state.reqPromise) {
      this.state.reqPromise.cancel();
    }

    let promise = danbo.posts({
      login: login,
      apikey: apikey,
      queries: solvedQueries,
      extra: expandAliases(extra, tagAliasesMap),
      filters: expandAliases(filters, tagAliasesMap),
      quantity: limit,
      offset: page * limit
    })

    promise.then(res =>
      this.setState({
        results: res,
        reqPromise: undefined
      })
    );

    promise.catch(err => {
      console.log(err);
      this.setState({
        reqPromise: undefined
      });
    });

    this.setState({
      reqPromise: promise
    });
  }
  componentWillUnmount() {
    if (this.state.reqPromise)
      this.state.reqPromise.cancel();
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
          <ImageResult post={post} className={CN(statusClasses)}
            onDetailsClick={this.handleDetailsClick}
            dataKey={{groupIndex: i, postIndex: j}} />
        );
      }

      resultsEls.push(
        <div key={i} className="search-results-group">
          <div className="search-results-group-title">
            <p>{ query }</p>
          </div>
          {
            (postsEls.length > 0) ?
            <div className="search-results-container">
              { postsEls }
            </div> :
            <div className="search-results-container empty">
              No results
            </div>
          }
        </div>
      );
    }

    let modalPreviewEl = null;
    if (this.state.modalPreview) {
      const groupIndex = this.state.modalPreview.groupIndex;
      const postIndex = this.state.modalPreview.postIndex;
      const post = this.state.results[groupIndex].posts[postIndex];

      modalPreviewEl =
        <Modal className="search-results-modal-preview"
          onExitClick={this.handlePreviewExit}>
          <Image alt={danbo.resumeTagString(post)}
            src={post.complete_large_proxy_url} />
          <Button className="slideshow-toggle" type="button"
            onClick={this.handleSlideshowClick}>
            {this.state.slideshowTimer ? "Stop Slideshow" : "Start Slideshow"}
          </Button>
        </Modal>;
    }

    return (
      <div className={CN("search-results", this.props.className)}>
        <div className="search-results-wrapper">
          {
            this.state.reqPromise != null &&
            <div className="search-results-busy-overlay">
              Fetching...
            </div>
          }
          { resultsEls }
          {
            resultsEls.length > 0 &&
            <SearchNav page={this.props.page}
              onPreviousPageClick={this.props.onPreviousPageClick}
              onGoExactPageClick={this.props.onGoExactPageClick}
              onNextPageClick={this.props.onNextPageClick}
              onRefreshClick={this.handleRefreshClick}
            />
          }
        </div>
        { modalPreviewEl }
      </div>
    );
  }
}

export default SearchResults;
