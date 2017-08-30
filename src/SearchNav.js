import React, { Component } from 'react';
import './style/SearchNav.css';

import Form   from './components/Form';
import Button from './components/Button';
import Input  from './components/Input';

class SearchNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: props.page
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePageSubmit = this.handlePageSubmit.bind(this);
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
  handlePageSubmit() {
    this.props.onGoExactPageClick(this.state.page);
  }
  render() {
    return (
      <div className="search-nav">
        <Button className="search-nav-item" onClick={this.props.onPreviousPageClick}>
          <i className="fa fa-angle-left" aria-hidden="true"></i>
        </Button>
        <Form className="search-nav-item" onSubmit={this.handlePageSubmit}>
          <Input name="page" type="number"
            value={this.state.page} onChange={this.handleChange} />
        </Form>
        <Button className="search-nav-item" onClick={this.handlePageSubmit}>go</Button>
        <Button className="search-nav-item" onClick={this.props.onNextPageClick}>
          <i className="fa fa-angle-right" aria-hidden="true"></i>
        </Button>
      </div>
    );
  }
}

export default SearchNav;
