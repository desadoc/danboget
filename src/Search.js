import React, { Component } from 'react';
import './style/Search.css';
import CN from 'classnames';

import SideBar        from './SideBar';
import SearchResults  from './SearchResults';
import SearchForm     from './SearchForm';
import Settings       from './Settings';
import AlertContainer from './components/AlertContainer';

import utils    from './lib/utils';
import danbooru from './lib/danbooru';

let defaultAliases = [
  {
    name: 'safe',
    tags: 'rating:s -ass -breasts -panties -bra'
  },
  {
    name: 'super_safe',
    tags: 'rating:s -ass -breasts -panties -bra -bikini -legs -midriff ' +
          '-pantyhose score:>=5'
  }
];

function expandAliases(query, aliasesMap) {
  let queryTags = query.split(' ');
  for (let i=0; i<queryTags.length; i++) {
    let queryTag = queryTags[i];
    let definition = aliasesMap[queryTag];
    if (definition != null) {
      queryTags[i] = definition;
    }
  }
  return queryTags.reduce(function(a, b) {
    if (a) return a + ' ' + b;
    return b;
  }, '');
}

class Search extends Component {
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
      results: [],
      sideBarStatus: ''
    };

    AlertContainer.init(this);

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
    }, () => this.fetchPosts());
  }
  componentDidMount() {
    let settingsString = this.localStorage.getItem("settings");
    let fromStorage = null;
    if (settingsString) {
      fromStorage = JSON.parse(settingsString);
    } else {
      fromStorage = {
        tagAliases: []
      };
    }

    let login = fromStorage.login || '';
    let apikey = fromStorage.apikey || '';
    let slideshowInterval = fromStorage.slideshowInterval || 5;
    let tagAliases = fromStorage.tagAliases;

    if (tagAliases.length === 0) {
      tagAliases = defaultAliases;
      this.setState({
        settings: {
          tagAliases: tagAliases
        }
      })
    }

    let settings = {
      login: login,
      apikey: apikey,
      slideshowInterval : slideshowInterval,
      tagAliases: tagAliases
    };

    this.localStorage.setItem("settings", JSON.stringify(settings));

    this.setState({
      settings: settings,
      search: this.getSearchParams(this.props.location.search)
    }, () => this.fetchPosts());
  }
  fetchPosts() {
    AlertContainer.clear(this);

    let login = this.state.settings.login;
    let apikey = this.state.settings.apikey;
    let tagAliases = this.state.settings.tagAliases;
    let query = this.state.search.query;
    let extra = this.state.search.extra;
    let filters = this.state.search.filters;
    let limit = this.state.search.limit;
    let page = this.state.search.page;

    if (query == null) {
      this.setState({
        results: []
      });
      return;
    }

    let queries = query.match(/[^\r\n]+/g);
    if (queries == null) {
      queries = [''];
    }

    let tagAliasesMap = {};
    for (let i=0; i<tagAliases.length; i++) {
      tagAliasesMap[tagAliases[i].name] = tagAliases[i].tags;
    }

    let solvedQueries = [];
    for (let i=0; i<queries.length; i++) {
      solvedQueries.push(
        expandAliases(queries[i], tagAliasesMap)
      );
    }

    if (this.state.reqPromise) {
      this.state.reqPromise.cancel();
    }

    let promise = danbooru.posts({
      login: login,
      apikey: apikey,
      queries: solvedQueries,
      extra: expandAliases(extra, tagAliasesMap),
      filters: expandAliases(filters, tagAliasesMap),
      quantity: limit,
      offset: page * limit
    })

    promise.then(res => {
      this.setState({
        results: res,
        reqPromise: undefined
      });
    });

    promise.catch(err => {
      AlertContainer.addMessage(this, {
        text: 'Error: ' + err.response.data.message,
        type: 'error'
      });
      this.setState({
        results: [],
        reqPromise: undefined
      });
    });

    this.setState({
      reqPromise: promise
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
      "/search?" + queryStr
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
    AlertContainer.clear(this);
    this.setState({ sideBarStatus: selection });
  }
  render() {
    const isFetching = this.state.reqPromise != null;

    const SearchFormWProps = (props) =>
      <SearchForm {...this.state.search} disabled={isFetching}
        onSubmit={this.handleSearchSubmit}/>;
    const SettingsWProps = (props) =>
      <Settings {...this.state.settings}
        onSubmit={this.handleSettingsSubmit} />;

    const squeezeAppRight =
      this.state.sideBarStatus ? 'squeezed-right' : null;

    let postCount = this.state.results.reduce(function(accum, result) {
      return accum + result.posts.length;
    }, 0);

    return (
      <div className='search'>
        <div className={CN('search-container', squeezeAppRight)}>
          <SideBar
            alerts={AlertContainer.present(this)}
            pages={{
              search: SearchFormWProps, settings: SettingsWProps
            }}
            sideBarStatus={this.state.sideBarStatus}
            onChange={this.handleSideBarChange}
            postCount={postCount} isFetching={isFetching}
            />
          <SearchResults results={this.state.results}
            page={this.state.search.page}
            slideshowInterval={this.state.settings.slideshowInterval}
            isFetching={this.state.reqPromise != null}
            onPreviousPageClick={this.handlePreviousPageClick}
            onGoExactPageClick={this.handleGoExactPageClick}
            onNextPageClick={this.handleNextPageClick} />
        </div>
      </div>
    );
  }
}

export default Search;
