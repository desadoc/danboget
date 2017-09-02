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
      dirty: true,
      login: {
        id: utils.createId(),
        value: props.values.login
      },
      apikey: {
        id: utils.createId(),
        value: props.values.apikey
      },
      tagAliases: tagAliasesToControlData(props.values.tagAliases)
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTagAliasRemove = this.handleTagAliasRemove.bind(this);
    this.handleTagAliasAdd = this.handleTagAliasAdd.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState(prevState => {
      prevState.login.value = nextProps.values.login;
      prevState.apikey.value = nextProps.values.apikey;
      prevState.tagAliases =
        tagAliasesToControlData(nextProps.values.tagAliases);
      return prevState;
    });
  }
  handleChange(name, value) {
    let matches = name.match(/^tagAliases_(name|tags)_(\d+)$/);
    console.log(JSON.stringify(matches));
    if (matches.length > 0) {
      let field = matches[1];
      let index = parseInt(matches[2], 10);
      this.setState(prevState => {
        prevState.tagAliases[index][field].value = value;
        return prevState;
      });
    } else {
      this.setState(prevState => {
        prevState.dirty = true;
        prevState[name].value = value;
        return prevState;
      });
    }
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

    this.props.onSubmit({
      login: this.state.login.value,
      apikey: this.state.apikey.value,
      tagAliases: tagAliases
    });
    this.setState({ dirty: false });
  }
  handleTagAliasRemove(index) {
    this.setState(prevState => {
      prevState.tagAliases.splice(index, 1);
      return prevState;
    });
  }
  handleTagAliasAdd() {
    this.setState(prevState => {
      prevState.tagAliases.push({
        name : {
          id: utils.createId(),
          value: ''
        },
        tags: {
          id: utils.createId(),
          value: ''
        }
      });
      return prevState;
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
              type="text" name={"tagAliases_name_" + i}
              value={this.state.tagAliases[i].name.value}
              onChange={this.handleChange} />
          </div>
          <div className="input-group settings-tagaliases-tags">
            <Label htmlFor={this.state.tagAliases[i].tags.id}>Tags:</Label>
            <Input id={this.state.tagAliases[i].tags.id}
              type="text" name={"tagAliases_tags_" + i}
              value={this.state.tagAliases[i].tags.value}
              onChange={this.handleChange} />
          </div>
          <div className="input-group settings-tagaliases-remove-btn">
            <Button type="button" onClick={() => this.handleTagAliasRemove(i)}>
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
                <Input id={this.state.login.id} type="text" name="login"
                  value={this.state.login.value} onChange={this.handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <Label htmlFor={this.state.apikey.id}>Apikey:</Label>
                <Input id={this.state.apikey.id} type="text" name="apikey"
                  value={this.state.apikey.value} onChange={this.handleChange} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Tag Aliases</div>

            {tagAliasesEls}

            <div className="form-row">
              <div className="input-group">
                <Button type="button"
                  onClick={this.handleTagAliasAdd}>
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
