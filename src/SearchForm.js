import React, { Component } from 'react';
import './style/SearchForm.css';

import Form   from './components/Form';
import Input  from './components/Input';
import Label  from './components/Label';
import Button from './components/Button';

import utils from './lib/utils';

class SearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: {
        id: utils.createId(),
        value: props.query || ''
      },
      filters: {
        id: utils.createId(),
        value: props.filters || ''
      },
      limit: {
        id: utils.createId(),
        value: props.limit
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState(prevState => {
      prevState.query.value = nextProps.query || '';
      prevState.filters.value = nextProps.filters || '';
      prevState.limit.value = nextProps.limit;
      return prevState;
    });
  }
  handleSubmit() {
    this.props.onSubmit({
      query: this.state.query.value,
      filters: this.state.filters.value,
      limit: this.state.limit.value
    });
  }
  handleChange(name, value) {
    this.setState(prevState => {
      prevState[name].value = value;
      return prevState;
    });
  }
  render() {
    return (
      <Form className="search-form" onSubmit={this.handleSubmit}>
        <div className="form-row">
          <div className="input-group search-form-query">
            <Label htmlFor={this.state.query.id}>Query:</Label>
            <Input type="text"
              name="query" value={this.state.limit.query} onChange={this.handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="input-group search-form-filters">
            <Label htmlFor={this.state.filters.id}>Filters:</Label>
            <Input type="text" name="filters"
              value={this.state.filters.value} onChange={this.handleChange} />
          </div>
          <div className="input-group search-form-limit">
            <Label htmlFor={this.state.limit.id}>Limit:</Label>
            <Input type="number" name="limit"
              value={this.state.limit.value} onChange={this.handleChange} />
          </div>
          <div className="input-group search-form-submit-btn">
            <Button type="submit">Search</Button>
          </div>
        </div>
      </Form>
    );
  }
}

export default SearchForm;
