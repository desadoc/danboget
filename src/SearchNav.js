import React, { Component } from 'react';
import './style/SearchNav.css';

import Button from './components/Button';
import Input  from './components/Input';

class SearchNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: props.page
    };

    this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      page: nextProps.page
    });
  }
  handleChange(name, value) {
    this.setState({
      page: value
    });
  }
  render() {
    return (
      <div className="search-nav">
        <Button className="search-nav-item" onClick={this.props.onPreviousPageClick}>
          <i className="fa fa-angle-left" aria-hidden="true"></i>
        </Button>
        <Input className="search-nav-item search-nav-page" name="page" type="number"
          state={this.state} onChange={this.handleChange} />
        <Button className="search-nav-item search-nav-go-btn"
          onClick={() => {this.props.onGoExactPageClick(this.state.page)}}
        >
          go
        </Button>
        <Button className="search-nav-item" onClick={this.props.onNextPageClick}>
          <i className="fa fa-angle-right" aria-hidden="true"></i>
        </Button>
      </div>
    );
  }
}

export default SearchNav;
