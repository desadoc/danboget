import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './style/TopMenu.css';

class TopMenu extends Component {
  render() {
    return (
      <div className="top-menu">
        <Link to="/search">Search</Link>
        <Link to="/settings">Settings</Link>
      </div>
    );
  }
}

export default TopMenu;
