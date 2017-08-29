import React, { Component } from 'react';
import './style/Search.css';

import SearchForm   from './SearchForm';
import ImageResult  from './components/ImageResult';
import Button       from './components/Button';

let danbooru = require('./lib/danbooru');
let utils    = require('./lib/utils');

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = this.createState(props.location.search);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }
  componentDidMount() {
    this.doQuery();
  }
  componentWillReceiveProps(nextProps) {
    this.setState(
      this.createState(nextProps.location.search),
      () => {
        setTimeout(() => { this.doQuery(); });
      }
    );
  }
  createState(queryStr) {
    let params = utils.parseQueryString(queryStr);

    return {
      pages: [],
      currPage: (params.page  != null) ? parseInt(params.page, 10) : 0,
      pageSize: (params.limit != null) ? parseInt(params.limit, 10) : 20,
      query:    params.query.replace('+', ' ')
    }
  }
  handleSubmit(params) {
    this.props.history.push(
      '/search?' + utils.stringifyQueryParams({
        query: params.query.replace(' ', '+'),
        limit: params.limit,
        page: 0
      })
    );
  }
  doQuery() {
    if (this.state.query == null)
      return;

    this.fetchPage(
      this.state.currPage,
      this.state.query,
      this.state.pageSize
    )
    .then(res => {
      this.setState(prevState => {
        prevState.pages[prevState.currPage] = res;
        return prevState;
      });
    })
    .catch(err => {
      console.log(err);
    });
  }
  fetchPage(index, query, limit) {
    return danbooru.posts({
      login: this.props.login,
      apikey: this.props.apikey,
      tags: query,
      quantity: limit,
      offset: index * limit
    });
  }
  nextPage() {
    this.props.history.push(
      '/search?' + utils.stringifyQueryParams({
        query: this.state.query.replace(' ', '+'),
        limit: this.state.pageSize,
        page: this.state.currPage + 1
      })
    );
  }
  render() {
    let resultEls = [];

    if (this.state.currPage !== null) {
      let results = this.state.pages[this.state.currPage];

      if (results) {
        for (let i=0; i<results.length; i++) {
          let result = results[i];
          resultEls.push(
            <ImageResult key={result.id} src={result.complete_preview_url} />
          );
        }
      }
    }

    return (
      <div className="Search">
        <SearchForm query={this.state.query}
          limit={this.state.pageSize} onSubmit={this.handleSubmit} />
        {resultEls}
        { (this.state.query != null) &&
            <Button onClick={this.nextPage}>Next Page</Button> }
      </div>
    );
  }
}

export default Search;
