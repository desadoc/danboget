var async = require('async');
var axios = require('axios');

var danbooruUrl = "https://danbooru.donmai.us";
var hardQueryLimit = 100;

function convertPostEntries(posts) {
	for (let i = 0; i < posts.length; i++) {
		var post = posts[i];

		post.complete_post_url = danbooruUrl + '/posts/' + post.id;
		post.tags_artist = post.tag_string_artist.split(' ');
		post.tags_copyright = post.tag_string_copyright.split(' ');
		post.tags_character = post.tag_string_character.split(' ');
		post.tags_general = post.tag_string_general.split(' ');

		post.complete_large_url = danbooruUrl + post.large_file_url;
    post.complete_preview_url = danbooruUrl + post.preview_file_url;

		var imgWidth = post.image_width
		var imgHeight = post.image_height

		if (imgWidth < imgHeight) {
			post.preview_height = 150;
			post.preview_width = (imgWidth / imgHeight) * 150;
		} else {
			post.preview_height = (imgHeight / imgWidth) * 150;
			post.preview_width = 150;
		}
	}

	return posts;
}

function singleQuery(params) {

	let requestUrl = danbooruUrl + "/posts.json";

	let login = params.login;
	let apikey = params.apikey;
	let tags = params.tags;
	let first = params.offset || 0;
	let quantity = params.quantity || 20;

	console.log(tags);

	return new Promise(function(resolve, reject) {

		let last = first + quantity
		let firstOffset = first % hardQueryLimit;
		let queryPage = ((first - firstOffset)/hardQueryLimit) + 1;

		let queries = [];
		while (((queryPage-1) * hardQueryLimit) < last) {

			queries.push({
				limit : hardQueryLimit,
				page : queryPage
			});

			queryPage += 1;
		}

    let doQuery = function(item, cb) {
      axios.get(requestUrl, {
				params: {
					tags: tags,
					login: login,
					api_key: apikey,
					limit: item.limit,
					page: item.page
			}})
      .then(res => {
        try {
          let posts = convertPostEntries(res.data);

          cb(null, posts);

        } catch(ex) {
          cb(ex);
        }
      })
      .catch(err => {
        cb(err);
      });
    };

    let doFinal = function (err, results) {
      if (err) {
        reject(err);
        return;
      }

      let arr = [];

      for (let i=0; i<results.length; i++)
        arr = arr.concat(results[i]);

      resolve(arr.slice(firstOffset, firstOffset + quantity));
    };

		async.mapLimit(queries, 2, doQuery, doFinal);
  });
}

function processFilterString(filterString) {
	if (!filterString)
		return {};

	let tokens = filterString.split(' ');

	let all = [];
	let neg = [];
	let any = [];

	for (let i=0; i<tokens.length; i++) {
		let token = tokens[i];
		if (token.startsWith('-')) {
			neg.push(token.substring(1));
			continue;
		}
		if (token.startsWith('~')) {
			any.push(token.substring(1));
			continue;
		}
		all.push(token);
	}

	return {
		all: (all.length > 0) ? all : undefined,
		neg: (neg.length > 0) ? neg : undefined,
		any: (any.length > 0) ? any : undefined,
	};
}

function applySpecialFilterTag(post, filterTag) {

	if (filterTag.match(/^rating:[sqe]$/)) {
		let rating = filterTag.substring("rating:".length);
		if (rating.startsWith(post.rating)) {
			return true;
		} else {
			return false;
		}
	}

	if (filterTag.match(/^score:(>|>=|<|<=)?\d+$/)) {
		let valueStr = filterTag.substring("score:".length);

		if (valueStr.startsWith("<")) {
			if (valueStr.startsWith("<=")) {
				return post.score <= parseInt(valueStr.substring(2), 10);
			} else {
				return post.score < parseInt(valueStr.substring(1), 10);
			}
		}

		if (valueStr.startsWith(">")) {
			if (valueStr.startsWith(">=")) {
				return post.score >= parseInt(valueStr.substring(2), 10);
			} else {
				return post.score > parseInt(valueStr.substring(1), 10);
			}
		}

		return post.score === parseInt(valueStr, 10);
	}

	if (filterTag.match(/^width:(>|>=|<|<=)?\d+$/)) {
		let valueStr = filterTag.substring("width:".length);

		if (valueStr.startsWith("<")) {
			if (valueStr.startsWith("<=")) {
				return post.image_width <= parseInt(valueStr.substring(2), 10);
			} else {
				return post.image_width < parseInt(valueStr.substring(1), 10);
			}
		}

		if (valueStr.startsWith(">")) {
			if (valueStr.startsWith(">=")) {
				return post.image_width >= parseInt(valueStr.substring(2), 10);
			} else {
				return post.image_width > parseInt(valueStr.substring(1), 10);
			}
		}

		return post.image_width === parseInt(valueStr, 10);
	}

	if (filterTag.match(/^height:(>|>=|<|<=)?\d+$/)) {
		let valueStr = filterTag.substring("height:".length);

		if (valueStr.startsWith("<")) {
			if (valueStr.startsWith("<=")) {
				return post.image_height <= parseInt(valueStr.substring(2), 10);
			} else {
				return post.image_height < parseInt(valueStr.substring(1), 10);
			}
		}

		if (valueStr.startsWith(">")) {
			if (valueStr.startsWith(">=")) {
				return post.image_height >= parseInt(valueStr.substring(2), 10);
			} else {
				return post.image_height > parseInt(valueStr.substring(1), 10);
			}
		}

		return post.image_height === parseInt(valueStr, 10);
	}

	let postTags = post.tag_string.split(' ');

	if (filterTag.startsWith("*") && filterTag.endsWith("*")) {
		let valueToMatch = filterTag.substring(1, filterTag.length-1);
		for (let i=0; i<postTags.length; i++) {
			let tag = postTags[i];
			if (tag.indexOf(valueToMatch) >= 0) {
				return true;
			}
		}
		return false;
	}

	if (filterTag.startsWith("*")) {
		let valueToMatch = filterTag.substring(1);
		for (let i=0; i<postTags.length; i++) {
			let tag = postTags[i];
			if (tag.endsWith(valueToMatch)) {
				return true;
			}
		}
		return false;
	}

	if (filterTag.endsWith("*")) {
		let valueToMatch = filterTag.substring(0, filterTag.length-1);
		for (let i=0; i<postTags.length; i++) {
			let tag = postTags[i];
			if (tag.startsWith(valueToMatch)) {
				return true;
			}
		}
		return false;
	}

	return undefined;
}

function filterPosts(posts, filters) {
	let result = [];

	let all = filters.all;
	let neg = filters.neg;
	let any = filters.any;

	for (let i=0; i<posts.length; i++) {
		let post = posts[i];
		let tags = post.tag_string.split(' ');

		let keep = true;

		if (all) {
			for (let j=0; j<all.length; j++) {
				let tag = all[j];

				let specialMatch = applySpecialFilterTag(post, tag);
				if (specialMatch !== undefined) {
					if (specialMatch === false) {
						keep = false;
						break;
					} else {
						continue;
					}
				}

				if (tags.indexOf(tag) < 0) {
					keep = false;
					break;
				}
			}
		}

		if (neg) {
			for (let j=0; j<neg.length; j++) {
				let tag = neg[j];

				let specialMatch = applySpecialFilterTag(post, tag);
				if (specialMatch !== undefined) {
					if (specialMatch === true) {
						keep = false;
						break;
					} else {
						continue;
					}
				}

				if (tags.indexOf(tag) >= 0) {
					keep = false;
					break;
				}
			}
		}

		if (any) {
			let matched = false;
			for (let j=0; j<any.length; j++) {
				let tag = any[j];

				let specialMatch = applySpecialFilterTag(post, tag);
				if (specialMatch !== undefined) {
					if (specialMatch === true) {
						matched = true;
						break;
					} else {
						continue;
					}
				}

				if (tags.indexOf(tag) >= 0) {
					matched = true;
					break;
				}
			}
			keep = keep && matched;
		}

		if (keep) {
			result.push(post);
		}
	}
	return result;
}

exports.posts = function(params) {

	let queries = [''];
	let extra = params.extra || '';

	if (params.queries && params.queries.length > 0)
		queries = params.queries;

	let filters = processFilterString(params.filters);

	return new Promise(function(resolve, reject){
		let doQuery = function(query, cb) {
			singleQuery({
				login: params.login,
				apikey: params.apikey,
				tags: query + ' ' + extra,
				offset: params.offset,
				quantity: params.quantity
			})
			.then(posts => {
				cb(null, { query: query, posts: filterPosts(posts, filters) });
			})
			.catch(err => { cb(err); });
		}

		let doFinal = function (err, results) {
			if (err) {
				reject(err);
				return;
			}

			resolve(results);
		};

		async.mapLimit(queries, 6, doQuery, doFinal);
	});
}

exports.resumeTagString = function(post, limit) {
	limit = limit || 150;
	let tagString = '';

	if (post.tag_string_artist)
		tagString += post.tag_string_artist + ' ';

	if (post.tag_string_copyright)
		tagString += post.tag_string_copyright + ' ';

	if (post.tag_string_character)
		tagString += post.tag_string_character + ' ';

	if (post.tag_string_general)
		tagString += post.tag_string_general;

	if (tagString.length > limit)
		tagString = tagString.substr(0, limit-3) + "...";

	return tagString;
}
