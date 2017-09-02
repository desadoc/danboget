import React, { Component } from 'react';
import './style/Search.css';

import SearchForm     from './SearchForm';
import SearchResults  from './SearchResults';
import SearchNav      from './SearchNav';

let utils    = require('./lib/utils');

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = this.createState(props.location.search);

    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handlePreviousPageClick = this.handlePreviousPageClick.bind(this);
    this.handleGoExactPageClick = this.handleGoExactPageClick.bind(this);
    this.handleNextPageClick = this.handleNextPageClick.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState(this.createState(nextProps.location.search));
  }
  createState(queryStr) {
    let params = utils.parseQueryString(queryStr);

    return {
      query: (params.query != null) ? params.query.replace(/\+/g, ' ') : '',
      extra: (params.extra != null) ? params.extra.replace(/\+/g, ' ') : '',
      filters:
        (params.filters != null) ? params.filters.replace(/\+/g, ' ') : '',
      limit: (params.limit != null) ? parseInt(params.limit, 10) : 20,
      page:  (params.page  != null) ? parseInt(params.page, 10) : 0,
      mode: (params.mode != null) ? params.mode : "single"
    }
  }
  navigate(query, extra, filters, limit, page, mode) {
    query = query ? query.replace(/ /g, '+') : null;
    extra = extra ? extra.replace(/ /g, '+') : null;
    filters = filters ? filters.replace(/ /g, '+') : null;
    limit = (limit !== 20) ? limit : null;
    page  = page ? page : null;
    mode  = (mode === "multiple") ? "multiple" : null;

    let queryStr = utils.stringifyQueryParams({
        query: query, extra: extra, filters: filters,
        limit: limit, page: page, mode: mode
    });

    this.props.history.push(
      "/search?" + queryStr
    );
  }
  handleSearchSubmit(params) {
    this.navigate(
      params.query, params.extra, params.filters,
      params.limit, 0, this.state.mode
    );
  }
  handleToggleClick() {
    this.navigate(
      this.state.query && this.state.query.match(/[^\r\n]+/g)[0],
      this.state.extra,
      this.state.filters,
      this.state.limit,
      this.state.page,
      (this.state.mode === "single") ? "multiple" : "single"
    );
  }
  goToPage(index) {
    this.navigate(
      this.state.query,
      this.state.extra,
      this.state.filters,
      this.state.limit,
      (index > 0) ? index : 0,
      this.state.mode
    );
  }
  handlePreviousPageClick() {
    this.goToPage(this.state.page - 1);
  }
  handleGoExactPageClick(page) {
    this.goToPage(page);
  }
  handleNextPageClick() {
    this.goToPage(this.state.page + 1);
  }
  render() {
    return (
      <div className="search">
        <SearchForm query={this.state.query} extra={this.state.extra}
          filters={this.state.filters} limit={this.state.limit}
          mode={this.state.mode} onToggleClick={this.handleToggleClick}
          onSubmit={this.handleSearchSubmit} />
        <SearchResults
          login={this.props.login} apikey={this.props.apikey}
          tagAliases={this.props.tagAliases}
          query={this.state.query} extra={this.state.extra}
          filters={this.state.filters} limit={this.state.limit}
          page={this.state.page}
        />
        <SearchNav page={this.state.page}
          onPreviousPageClick={this.handlePreviousPageClick}
          onGoExactPageClick={this.handleGoExactPageClick}
          onNextPageClick={this.handleNextPageClick}
        />
      </div>
    );
  }
}

export default Search;
