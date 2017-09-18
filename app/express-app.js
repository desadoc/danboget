var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

exports.start = function(port, cb) {
  var app = express();
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/public'));

  const danbooruUrl = "https://danbooru.donmai.us/";

  app.get('/api/proxy/:url(*)', (req, res) => {
    let proxyReq = request.get(danbooruUrl + req.params.url);

    proxyReq.pipe(res);
    proxyReq.on('error', err => {
      console.log(err);
      res.status(500).end();
    })
  });

  app.listen(port, cb);

  return app;
}
