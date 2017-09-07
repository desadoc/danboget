var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
app.use(bodyParser.json());

const danbooruUrl = "https://danbooru.donmai.us/";

app.get('/api/proxy/:url(*)', (req, res) => {
  let proxyReq = request.get(danbooruUrl + req.params.url);

  proxyReq.pipe(res);
  proxyReq.on('error', err => {
    console.log(err);
    res.status(500).end();
  })
});

app.listen(3001, function () {
  console.log('Backend App listening on port 3001!');
});
