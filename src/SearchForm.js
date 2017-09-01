import React, { Component } from 'react';
import './style/SearchForm.css';

import Form     from './components/Form';
import Input    from './components/Input';
import TextArea from './components/TextArea';
import Label    from './components/Label';
import Button   from './components/Button';

import utils from './lib/utils';

class SearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: {
        id: utils.createId(),
        value: props.query || ''
      },
      extra: {
        id: utils.createId(),
        value: props.extra || ''
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
      prevState.query.value = nextProps.query || "";
      prevState.extra.value = nextProps.extra || "";
      prevState.limit.value = nextProps.limit;
      return prevState;
    });
  }
  handleSubmit() {
    this.props.onSubmit({
      query: this.state.query.value,
      extra: this.state.extra.value,
      limit: this.state.limit.value,
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
            { (this.props.mode === "single") ?
              <Input type="text" name="query"
                value={this.state.query.value} onChange={this.handleChange} /> :
              <TextArea name="query" rows="10" onChange={this.handleChange}
                value={this.state.query.value} />
            }

          </div>
          <div className="input-group search-form-mode-toggle">
            <Button type="button" onClick={this.props.onToggleClick}>
              {
                (this.props.mode === "single") ?
                <i className="fa fa-sort-desc" aria-hidden="true"></i> :
                <i className="fa fa-sort-asc" aria-hidden="true"></i>
              }
            </Button>
          </div>
        </div>
        <div className="form-row">
          <div className="input-group search-form-filters">
            <Label htmlFor={this.state.extra.id}>Extra:</Label>
            <Input type="text" name="extra"
              value={this.state.extra.value} onChange={this.handleChange} />
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
