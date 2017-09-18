const {app, BrowserWindow} = require('electron');
const expressApp = require('./express-app');

let win = null;
let backendApp = null;

function createWindow () {
  win = new BrowserWindow();

  win.loadURL('http://localhost:8080/');
  win.maximize();

  win.on('closed', () => {
    win = null
  });
}

app.on('ready', () => {
  backendApp = expressApp.start(8080, () => createWindow());
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
});
