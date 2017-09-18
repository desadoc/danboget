import React, { Component } from 'react';
import './style/SideBar.css';
import CN from 'classnames';

import SideBarMenu from './SideBarMenu';

class SideBar extends Component {
  render() {
    const SearchForm = this.props.pages.search;
    const SettingsForm = this.props.pages.settings;

    const hiddenClass =
      this.props.sideBarStatus ? null : 'hidden';

    return (
      <div className={CN("side-bar", hiddenClass)}>
      <div className="side-bar-title">
        <h1>DanboGet</h1>
      </div>
        <div className="side-bar-page">
          { this.props.alerts }
          {this.props.sideBarStatus === "search" && <SearchForm />}
          {this.props.sideBarStatus === "settings" && <SettingsForm />}
        </div>
        <SideBarMenu isFetching={this.props.isFetching}
          onChange={this.props.onChange} postCount={this.props.postCount} />
      </div>
    );
  }
}

export default SideBar;
