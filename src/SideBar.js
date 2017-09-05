import React, { Component } from 'react';
import './style/SideBar.css';
import CN from 'classnames';

import Button from './components/Button';

class SideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selection: ''
    };

    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
  }
  handleMenuItemClick(itemName) {
    if (this.state.selection === itemName) {
      this.props.onChange('');
      this.setState({ selection: ''});
      return;
    }

    this.props.onChange(itemName);
    this.setState({ selection: itemName});
  }
  render() {
    const SearchForm = this.props.pages.search;
    const SettingsForm = this.props.pages.settings;

    const hidden = this.state.selection ? null : "hidden";

    return (
      <div className={CN("side-bar", hidden)}>
        <div className="side-bar-title">
          DanboGet
        </div>
        <div className="side-bar-page">
          {this.state.selection === "search" && <SearchForm />}
          {this.state.selection === "settings" && <SettingsForm />}
        </div>
        <div className="side-bar-menu">
          <Button className={CN(
              "side-bar-menu-item", "first-item",
              this.state.selection === "search" && "selected"
            )}
            type="button" onClick={() => this.handleMenuItemClick("search")}>
            <i className="fa fa-search fa-2" aria-hidden="true"></i>
          </Button>
          <Button className={CN(
              "side-bar-menu-item",
              this.state.selection === "settings" && "selected"
            )}
            type="button" onClick={() => this.handleMenuItemClick("settings")}>
            <i className="fa fa-cog fa-2" aria-hidden="true"></i>
          </Button>
        </div>
      </div>
    );
  }
}

export default SideBar;
