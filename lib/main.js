
const path = require('path');
const url = require('url');
const {app, BrowserWindow} = require('electron');

let win;


// TODO: generate HTML, spawn

function createWindow() {
  win = new BrowserWindow({width:800, height:600});
  win.loadURL(url.format({
    pathnam: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  win.on('closed', () => {
    win = null;
  });
}
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
