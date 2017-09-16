import React, { Component } from 'react';
import './style/SearchForm.css';

import Form     from './components/Form';
import Input    from './components/Input';
import TextArea from './components/TextArea';
import Label    from './components/Label';
import Button   from './components/Button';
import Tooltip  from './components/Tooltip';

import utils from './lib/utils';

class SearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: {
        id: utils.createId(),
        value: props.query
      },
      extra: {
        id: utils.createId(),
        value: props.extra
      },
      filters: {
        id: utils.createId(),
        value: props.filters
      },
      limit: {
        id: utils.createId(),
        value: props.limit
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillReceiveProps(props) {
    this.setState(state => {
      state.query.value = props.query;
      state.extra.value = props.extra;
      state.filters.value = props.filters;
      state.limit.value = props.limit;
      return state;
    });
  }
  handleSubmit() {
    this.props.onSubmit({
      query: this.state.query.value,
      extra: this.state.extra.value,
      filters: this.state.filters.value,
      limit: this.state.limit.value,
    });
  }
  handleChange(value, dataKey) {
    this.setState(state => {
      state[dataKey].value = value;
      return state;
    });
  }
  render() {
    const tooltips = {
      queries:
        'You can do multiple queries at once. Enter one query per line.',
      extra:
        'Tags entered here are added to each query.',
      limit:
        'Maximum number of posts that will be retrieved for each query',
      filters:
        'These tags will be used to filter posts received from danbooru, ' +
        'and they are applied locally, i.e. they do not count towards the ' +
        'tag count limit that danbooru imposes. Example: "*girls rating:s ' +
        '-long_hair ~blue_hair ~green_hair touhou"'
    };

    return (
      <Form className='search-form' onSubmit={this.handleSubmit}>
        <div className='form-section'>
          <div className='form-section-title'>Search</div>
          <div className='form-row'>
            <div className='input-group search-form-query'>
              <Label htmlFor={this.state.query.id}>
                Queries <Tooltip text={tooltips.queries} />:
              </Label>
              <TextArea id={this.state.query.id}
                name='query' rows='10' onChange={this.handleChange}
                dataKey='query' value={this.state.query.value} />
            </div>
          </div>

          <div className='form-row'>
            <div className='input-group search-form-extra'>
              <Label htmlFor={this.state.extra.id}>
                Extra  <Tooltip text={tooltips.extra} />:
              </Label>
              <Input type='text' name='extra' dataKey='extra'
                value={this.state.extra.value} onChange={this.handleChange} />
            </div>
            <div className='input-group search-form-limit'>
              <Label htmlFor={this.state.limit.id}>
                Limit <Tooltip text={tooltips.limit} />:
              </Label>
              <Input type='number' name='limit' dataKey='limit'
                value={this.state.limit.value} onChange={this.handleChange} />
            </div>

          </div>

          <div className='form-row'>
            <div className='input-group search-form-filters'>
              <Label htmlFor={this.state.filters.id}>
                Filters <Tooltip text={tooltips.filters} />:
              </Label>
              <Input type='text' name='filters' dataKey='filters'
                value={this.state.filters.value}
                onChange={this.handleChange} />
            </div>
            <div className='input-group search-form-submit-btn'>
              <Button type='submit'>Search</Button>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

export default SearchForm;
