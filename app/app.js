const expressApp = require('./express-app');
expressApp.start(8080, () => {
  console.log('DanboGet Backend is listening on port 8080');
});
