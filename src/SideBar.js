import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './style/SideBar.css';

class SideBar extends Component {
  render() {
    return (
      <div className="side-bar">
        <Link className="side-bar-item" to="/search">
          <i className="fa fa-search fa-2" aria-hidden="true"></i>
        </Link>
        <Link className="side-bar-item" to="/settings">
          <i className="fa fa-cog fa-2" aria-hidden="true"></i>
        </Link>
      </div>
    );
  }
}

export default SideBar;
