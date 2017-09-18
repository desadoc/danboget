import React, { Component } from 'react';
import './style/SideBarMenu.css';
import CN from 'classnames';

import Button from './components/Button';
import Image  from './components/Image';

class SideBarMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selection: '',
      highlightPostCount: false
    };

    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.isFetching && nextProps.isFetching) {
      setTimeout(() => this.setState({ highlightPostCount: false }));
      return;
    }

    if (this.props.isFetching && !nextProps.isFetching) {
      setTimeout(() => this.setState({ highlightPostCount: true }));
      setTimeout(() => this.setState({ highlightPostCount: false }), 6000);
    }
  }
  handleMenuItemClick(itemName) {
    if (this.state.selection === itemName) {
      this.props.onChange('');
      this.setState({
        selection: '',
        highlightPostCount: false
      });
      return;
    }

    if (itemName === 'results') {
      if (this.state.selection) {
        this.props.onChange('');
        this.setState({
          selection: '',
          highlightPostCount: false
        });
      } else {
        this.props.onChange('search');
        this.setState({ selection: 'search'});
      }
      return;
    }

    this.props.onChange(itemName);
    this.setState({ selection: itemName});
  }
  render() {
    return(
      <div className="side-bar-menu">
        <Button className={CN(
            "side-bar-menu-item", "first-item",
            this.state.selection === "search" && "selected"
          )}
          onClick={() => this.handleMenuItemClick('search')}>
          <i className="fa fa-search fa-2" aria-hidden="true"></i>
        </Button>
        <Button className={CN(
            "side-bar-menu-item",
            this.state.selection === "settings" && "selected"
          )}
          onClick={() => this.handleMenuItemClick('settings')}>
          <i className="fa fa-cog fa-2" aria-hidden="true"></i>
        </Button>
        <Button className={CN(
            "side-bar-menu-item result-count",
            this.state.highlightPostCount ? 'highlighted' : null
          )}
          onClick={() => this.handleMenuItemClick('results')}>
          {
            this.props.isFetching ?
            <Image className="loading-icon" src="assets/loading.png" /> :
            this.props.postCount
          }
        </Button>
      </div>
    );
  }
}

export default SideBarMenu;
