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

exports.posts = function(params) {

	let queries = [''];
	let extra = params.extra || '';

	if (params.queries && params.queries.length > 0)
		queries = params.queries;

	return new Promise(function(resolve, reject){
		let doQuery = function(query, cb) {
			singleQuery({
				login: params.login,
				apikey: params.apikey,
				tags: query + ' ' + extra,
				first: params.offset,
				quantity: params.quantity
			})
			.then(posts => { cb(null, { query: query, posts: posts }); })
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
