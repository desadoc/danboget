
exports.parseQueryString =
  function(queryStr) {
    if (queryStr.length === 0)
      return {};

    let str = queryStr.replace('?', '');
    let result = {};
    let params = str.split('&');

    for (let i=0; i<params.length; i++) {
      let segments = params[i].split('=');
      if (segments.length > 1) {
        result[segments[0]] = decodeURIComponent(segments[1]);
      } else {
        result[segments[0]] = [];
      }
    }

    return result;
  }

exports.stringifyQueryParams =
  function(queryParams) {
    let result = '';

    for (let name in queryParams) {
      if (!queryParams.hasOwnProperty(name))
        continue;

      let value = queryParams[name];
      if (value != null) {
        result += name + '=' + encodeURIComponent(value) + '&';
      }
    }

    if (result.length === 0)
      return '';

    return result.substring(0, result.length-1);
  }

let idCount = 0;

exports.createId = function(prefix) {
  prefix = (prefix != null) ? prefix : '_id';
  return prefix + ++idCount;
}

class CancelablePromise {
  constructor(promise) {
    this.promise = promise;
    this._canceled = false;
  }
  then(fn) {
    return this.promise.then((...args) => {
      if (!this._canceled)
        fn.apply(null, args);
    });
  }
  catch(fn) {
    return this.promise.catch((...args) => {
      if (!this._canceled)
        fn.apply(null, args);
    });
  }
  cancel() {
    this._canceled = true;
  }
}

exports.makeCancelablePromise = function(promise) {
  return new CancelablePromise(promise);
}
