import React, { Component } from 'react';
import './style/Search.css';

import SearchForm     from './SearchForm';
import SearchResults  from './SearchResults';

let utils    = require('./lib/utils');

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = this.createState(props.location.search);

    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleNextPageClick = this.handleNextPageClick.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState(this.createState(nextProps.location.search));
  }
  createState(queryStr) {
    let params = utils.parseQueryString(queryStr);

    return {
      page:  (params.page  != null) ? parseInt(params.page, 10) : 0,
      limit: (params.limit != null) ? parseInt(params.limit, 10) : 20,
      query: (params.query != null) ? params.query.replace(/\+/g, ' '): null
    }
  }
  handleSearchSubmit(params) {
    this.props.history.push(
      '/search?' + utils.stringifyQueryParams({
        query: params.query.replace(/ /g, '+'),
        limit: params.limit,
        page: 0
      })
    );
  }
  handleNextPageClick() {
    this.props.history.push(
      '/search?' + utils.stringifyQueryParams({
        query: this.state.query.replace(/ /g, '+'),
        limit: this.state.limit,
        page: this.state.page + 1
      })
    );
  }
  render() {
    return (
      <div className="Search">
        <SearchForm query={this.state.query}
          limit={this.state.limit} onSubmit={this.handleSearchSubmit} />
        <SearchResults onNextPageClick={this.handleNextPageClick}
          login={this.props.login} apikey={this.props.apikey}
          query={this.state.query} limit={this.state.limit}
          page={this.state.page} />
      </div>
    );
  }
}

export default Search;
