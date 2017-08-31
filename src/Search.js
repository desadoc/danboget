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
      page:  (params.page  != null) ? parseInt(params.page, 10) : 0,
      limit: (params.limit != null) ? parseInt(params.limit, 10) : 20,
      query: (params.query != null) ? params.query.replace(/\+/g, ' ') : null,
      filters: (params.filters != null) ?
                params.filters.replace(/\+/g, ' ') : null,
      mode: (params.mode != null) ? params.mode : "single"
    }
  }
  handleSearchSubmit(params) {
    this.props.history.push(
      '/search?' + utils.stringifyQueryParams({
        query: params.query.replace(/ /g, '+'),
        filters: params.filters.replace(/ /g, '+'),
        limit: params.limit,
        page: 0,
        mode: this.state.mode
      })
    );
  }
  handleToggleClick() {
    let query = this.state.query && this.state.query.match(/[^\r\n]+/g)[0];

    this.props.history.push(
      '/search?' + utils.stringifyQueryParams({
        query: query.replace(/ /g, '+'),
        filters: this.state.filters.replace(/ /g, '+'),
        limit: this.state.limit,
        page: this.state.page,
        mode: (this.state.mode === "single") ? "multiple" : "single"
      })
    );
  }
  goToPage(index) {
    this.props.history.push(
      '/search?' + utils.stringifyQueryParams({
        query: this.state.query.replace(/ /g, '+'),
        filters: this.state.filters.replace(/ /g, '+'),
        limit: this.state.limit,
        page: (index > 0) ? index : 0,
        mode: this.state.mode
      })
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
        <SearchForm query={this.state.query} filters={this.state.filters}
          limit={this.state.limit} mode={this.state.mode}
          onToggleClick={this.handleToggleClick}
          onSubmit={this.handleSearchSubmit} />
        <SearchResults
          login={this.props.login} apikey={this.props.apikey}
          query={this.state.query} filters={this.state.filters}
          limit={this.state.limit} page={this.state.page}
        />
        {
          (this.state.query != null) &&
          <SearchNav page={this.state.page}
            onPreviousPageClick={this.handlePreviousPageClick}
            onGoExactPageClick={this.handleGoExactPageClick}
            onNextPageClick={this.handleNextPageClick}
          />
        }
      </div>
    );
  }
}

export default Search;
