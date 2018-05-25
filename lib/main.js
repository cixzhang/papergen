const path = require('path');
const url = require('url');
const fs = require('fs');
const {app, BrowserWindow, ipcMain, webContents} = require('electron');

const { getSizeWithOrientation, toPixelsFromMM } = require('./pageSizes');
const { configPath } = require('./config');
const { rendererOptions } = require(configPath);

let win;

function createWindow() {
  const sizeInMM = getSizeWithOrientation(
    rendererOptions.pageSize,
    rendererOptions.landscape
  );
  const sizeInPx = toPixelsFromMM(sizeInMM, rendererOptions.ppi);
  win = new BrowserWindow({
    width: Math.ceil(sizeInPx[0]),
    height: Math.ceil(sizeInPx[1]),
    enableLargerThanScreen: true,
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

function makePDF() {
  if (!win) {
    console.error('[DEV] Tried to call makePDF without a window.');
    return;
  }

  const sizeInMM = getSizeWithOrientation(
    rendererOptions.pageSize,
    rendererOptions.landscape,
  );
  const landscape = Boolean(rendererOptions.landscape);
  const outfile = path.resolve(process.cwd(), rendererOptions.output);

  console.log('Creating PDF...');
  win.webContents.printToPDF({
    marginsType: 1,
    pageSize: {
      width: sizeInMM[0] * 1000,
      height: sizeInMM[1] * 1000,
    },
    landscape,
  }, (error, data) => {
    if (error) {
      console.error(error);
      return;
    }

    fs.writeFileSync(outfile, data);
    console.log('Complete!');
    app.quit();
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

