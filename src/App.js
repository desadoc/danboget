import React, { Component } from 'react';
import './style/App.css';
import CN from 'classnames';

import SideBar       from './SideBar';
import SearchResults from './SearchResults';
import SearchForm    from './SearchForm';
import Settings      from './Settings';

import utils from './lib/utils';

let defaultAliases = [
  {
    name: 'safe',
    tags: 'rating:s -ass -breasts -panties -bra'
  },
  {
    name: 'super_safe',
    tags: 'rating:s -ass -bikini -bra -breasts -legs -midriff -nude ' +
          '-panties -pantyhose -swimsuit -thighhighs'
  }
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: {
        login: '',
        apikey: '',
        slideshowInterval: 5,
        tagAliases: []
      },
      search: this.getSearchParams(props.location.search),
      sideBarStatus: ''
    };

    this.localStorage = window.localStorage;

    this.handleSettingsSubmit = this.handleSettingsSubmit.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handlePreviousPageClick = this.handlePreviousPageClick.bind(this);
    this.handleGoExactPageClick = this.handleGoExactPageClick.bind(this);
    this.handleNextPageClick = this.handleNextPageClick.bind(this);
    this.handleSideBarChange = this.handleSideBarChange.bind(this);
  }
  componentWillReceiveProps(props) {
    this.setState({
      search: this.getSearchParams(props.location.search)
    });
  }
  componentDidMount() {
    let values = this.localStorage.getItem("settings");
    if (!values) {
      return;
    }

    let fromStorage = JSON.parse(values);

    let login = fromStorage.login || '';
    let apikey = fromStorage.apikey || '';
    let tagAliases = fromStorage.tagAliases;

    if (tagAliases.length === 0) {
      tagAliases = defaultAliases;
    }

    this.setState({
      settings: {
        login: login,
        apikey: apikey,
        tagAliases: tagAliases
      }
    });
  }
  getSearchParams(queryString) {
    let params = utils.parseQueryString(queryString);

    return {
      query: (params.query != null) ? params.query.replace(/\+/g, ' ') : '',
      extra: (params.extra != null) ? params.extra.replace(/\+/g, ' ') : '',
      filters:
        (params.filters != null) ? params.filters.replace(/\+/g, ' ') : '',
      limit: (params.limit != null) ? parseInt(params.limit, 10) : 20,
      page:  (params.page  != null) ? parseInt(params.page, 10) : 0
    }
  }
  navigate(params) {
    let {query, extra, filters, limit, page} = params;

    query = query ? query.replace(/ /g, '+') : null;
    extra = extra ? extra.replace(/ /g, '+') : null;
    filters = filters ? filters.replace(/ /g, '+') : null;
    limit = (limit !== 20) ? limit : null;
    page  = page ? page : null;

    let queryStr = utils.stringifyQueryParams({query, extra, filters, limit, page});

    this.props.history.push(
      "/?" + queryStr
    );
  }
  navigateToPage(pageNumber) {
    let params = this.state.search;
    params.page = (pageNumber > 0) ? pageNumber : 0;
    this.navigate(params);
  }
  handleSettingsSubmit(values) {
    if (values.tagAliases.length === 0) {
      values.tagAliases = defaultAliases;
    }

    this.setState({
      settings: values
    });

    this.localStorage.setItem("settings", JSON.stringify(values));
  }
  handleSearchSubmit(values) {
    this.navigate(values);
  }
  handlePreviousPageClick() {
    this.navigateToPage(this.state.search.page-1);
  }
  handleGoExactPageClick(pageNumber) {
    this.navigateToPage(pageNumber);
  }
  handleNextPageClick() {
    this.navigateToPage(this.state.search.page+1);
  }
  handleSideBarChange(selection) {
    this.setState({ sideBarStatus: selection });
  }
  render() {
    const SearchFormWProps = (props) =>
      <SearchForm {...this.state.search}
        onSubmit={this.handleSearchSubmit}/>;
    const SettingsWProps = (props) =>
      <Settings {...this.state.settings}
        onSubmit={this.handleSettingsSubmit} />;

    const squeezeAppRight =
      this.state.sideBarStatus ? "squeezed-right" : null;

    return (
      <div className="app">
        <div className={CN("root-container", squeezeAppRight)}>
          <SideBar pages={{
            search: SearchFormWProps, settings: SettingsWProps
          }} onChange={this.handleSideBarChange} />
          <SearchResults
            {...this.state.settings} {...this.state.search}
            onPreviousPageClick={this.handlePreviousPageClick}
            onGoExactPageClick={this.handleGoExactPageClick}
            onNextPageClick={this.handleNextPageClick} />
        </div>
      </div>
    );
  }
}

export default App;
