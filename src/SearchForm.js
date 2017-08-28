import React, { Component } from 'react';
import './style/SearchForm.css';

import Form           from './components/Form';
import Input          from './components/Input';
import Button         from './components/Button';

class SearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      limit: 20
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    this.props.onSubmit({
      query: this.state.query,
      limit: this.state.limit
    });
  }
  handleChange(name, value) {
    this.setState(prevState => {
      prevState[name] = value;
      return prevState;
    });
  }
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Input type="text" name="query"
          state={this.state} onChange={this.handleChange} />
        <Input type="number" name="limit"
          state={this.state} onChange={this.handleChange} />
        <Button type="submit">Search</Button>
      </Form>
    );
  }
}

export default SearchForm;
