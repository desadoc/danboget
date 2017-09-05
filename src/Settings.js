import React, { Component } from 'react';
import './style/Settings.css';

import Form     from './components/Form';
import Input    from './components/Input';
import Label    from './components/Label';
import Button   from './components/Button';

import utils from './lib/utils';

function tagAliasesToControlData(tagAliases) {
  let result = [];
  for (let i=0; i<tagAliases.length; i++) {
    result.push({
      name: {
        id: utils.createId(),
        value: tagAliases[i].name
      },
      tags: {
        id: utils.createId(),
        value: tagAliases[i].tags
      }
    });
  }
  return result;
}

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dirty: false,
      login: {
        id: utils.createId(),
        value: props.login
      },
      apikey: {
        id: utils.createId(),
        value: props.apikey
      },
      tagAliases: tagAliasesToControlData(props.tagAliases)
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTagAliasChange = this.handleTagAliasChange.bind(this);
    this.handleTagAliasRemove = this.handleTagAliasRemove.bind(this);
    this.handleTagAliasAdd = this.handleTagAliasAdd.bind(this);
  }
  componentWillReceiveProps(props) {
    this.setState(state => {
      state.dirty = false;
      state.login.value = props.login;
      state.apikey.value = props.apikey;
      state.tagAliases =
        tagAliasesToControlData(props.tagAliases);
      return state;
    });
  }
  handleChange(value, dataKey) {
    this.setState(state => {
      state.dirty = true;
      state[dataKey].value = value;
      return state;
    });
  }
  handleTagAliasChange(value, dataKey) {
    this.setState(state => {
      state.tagAliases[dataKey.i][dataKey.f].value = value;
      state.dirty = true;
      return state;
    });
  }
  handleSubmit() {
    let tagAliases = [];
    let tagAliasesMap = {};

    for (let i=0; i<this.state.tagAliases.length; i++) {
      let name = this.state.tagAliases[i].name.value;
      let tags = this.state.tagAliases[i].tags.value;

      if (!name || !tags) { continue; }

      tagAliasesMap[name] = tags;
    }

    for (let key in tagAliasesMap) {
      tagAliases.push({name: key, tags: tagAliasesMap[key]});
    }
    this.setState(
      { dirty: false },
      () => {
        this.props.onSubmit({
          login: this.state.login.value,
          apikey: this.state.apikey.value,
          tagAliases: tagAliases
        });
      }
    );
  }
  handleTagAliasRemove(index) {
    this.setState(state => {
      state.dirty = true;
      state.tagAliases.splice(index, 1);
      return state;
    });
  }
  handleTagAliasAdd() {
    this.setState(state => {
      state.dirty = true;
      state.tagAliases.push({
        name : {
          id: utils.createId(),
          value: ''
        },
        tags: {
          id: utils.createId(),
          value: ''
        }
      });
      return state;
    });
  }
  render() {
    let submitBtnClass = null;
    if (!this.state.dirty)
      submitBtnClass = "button-ok";

    let tagAliasesEls = [];

    for (let i=0; i<this.state.tagAliases.length; i++) {
      tagAliasesEls.push(
        <div key={i} className="form-row">
          <div className="input-group settings-tagaliases-name">
            <Label htmlFor={this.state.tagAliases[i].name.id}>Name:</Label>
            <Input id={this.state.tagAliases[i].name.id}
              type="text" dataKey={{f: "name", i: i}}
              value={this.state.tagAliases[i].name.value}
              onChange={this.handleTagAliasChange} />
          </div>
          <div className="input-group settings-tagaliases-tags">
            <Label htmlFor={this.state.tagAliases[i].tags.id}>Tags:</Label>
            <Input id={this.state.tagAliases[i].tags.id}
              type="text" dataKey={{f: "tags", i: i}}
              value={this.state.tagAliases[i].tags.value}
              onChange={this.handleTagAliasChange} />
          </div>
          <div className="input-group settings-tagaliases-remove-btn">
            <Button type="button" dataKey={i} onClick={this.handleTagAliasRemove}>
              <i className="fa fa-trash-o" aria-hidden="true"></i>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <div className="settings">

          <div className="form-section">
            <div className="form-section-title">Credentials</div>

            <div className="form-row">
              <div className="input-group">
                <Label htmlFor={this.state.login.id}>Login:</Label>
                <Input id={this.state.login.id}
                  type="text" name="login" dataKey="login"
                  value={this.state.login.value} onChange={this.handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <Label htmlFor={this.state.apikey.id}>Apikey:</Label>
                <Input id={this.state.apikey.id}
                  type="text" name="apikey"  dataKey="apikey"
                  value={this.state.apikey.value} onChange={this.handleChange} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Tag Aliases</div>

            {tagAliasesEls}

            <div className="form-row">
              <div className="input-group">
                <Button type="button" onClick={this.handleTagAliasAdd}>
                  <i className="fa fa-plus" aria-hidden="true"></i>
                </Button>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-row">
              <div className="input-group">
                <Button className={submitBtnClass} type="submit">
                  {this.state.dirty ? "Save" : "Saved!"}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </Form>
    );
  }
}

export default Settings;
