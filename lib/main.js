const path = require('path');
const url = require('url');
const fs = require('fs');
const {app, BrowserWindow, ipcMain, webContents} = require('electron');

const { getSizeWithOrientation, toPixelsFromMM } = require('./pageSizes');
const { configPath } = require('./config');
const { options } = require(configPath);

let win;

function createWindow() {
  win = new BrowserWindow({
    width: options.debug ? 800 : 1,
    height: options.debug ? 600 : 1,
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  win.on('closed', () => {
    win = null;
  });
}

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function makePDF() {
  if (!win) {
    console.error('[DEV] Tried to call makePDF without a window.');
    return;
  }

  const __DEV__ = options.debug;

  const sizeInMM = getSizeWithOrientation(
    options.pageSize,
    options.landscape,
  );
  const landscape = Boolean(options.landscape);

  if (__DEV__) {
    console.log(options);
  }
  const outfile = path.resolve(process.cwd(), options.output);

  console.log('Creating PDF...');
  if (__DEV__) {
    console.log('Page Size', sizeInMM);
    console.log('Is Landscape', landscape);
  }
  win.webContents.printToPDF({
    marginsType: 1,
    pageSize: {
      width: sizeInMM[0] * 1000,
      height: sizeInMM[1] * 1000,
    },
  }, (error, data) => {
    if (error) {
      console.error(error);
      return;
    }

    ensureDirectoryExistence(outfile);
    fs.writeFileSync(outfile, data);
    console.log('Complete!');
    if (!__DEV__) {
      app.quit();
    }
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

ipcMain.on('render-complete', makePDF);

