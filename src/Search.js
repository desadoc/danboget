import React, { Component } from 'react';
import './style/Search.css';

import SearchForm from './SearchForm';
import ImageResult from './components/ImageResult';
import Button from './components/Button';

let danbooru = require('./lib/danbooru');

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pages: [],
      currPage: 0,
      pageSize: 20,
      query: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }
  handleSubmit(params) {
    let query = params.query;
    let limit = params.limit;

    this.fetchPage(0, query, limit)
    .then(res => {
      this.setState({
        pages: [res],
        currPage: 0,
        pageSize: limit,
        query: query
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
    this.fetchPage(
      this.state.currPage + 1,
      this.state.query,
      this.state.pageSize
    )
    .then(res => {
      this.setState(prevState => {
        prevState.pages.push(res);
        prevState.currPage++;
        return prevState;
      });
    })
    .catch(err => {
      console.log(err);
    });
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
        <SearchForm onSubmit={this.handleSubmit} />
        {resultEls}
        { (this.state.query != null) &&
            <Button onClick={this.nextPage}>Next Page</Button> }
      </div>
    );
  }
}

export default Search;
