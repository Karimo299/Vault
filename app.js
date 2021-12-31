const {app,BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');


let win;

// Loads Index.html
function createWindow() {
  const winWidth = 1200;
  const winHeight = 600;
  win = new BrowserWindow({
    width: winWidth,
    height: winHeight
  });
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'public/index.html'),
    protocol: 'file',
    slashes: true
  }));

  // Open Devtools
  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);


//Quit when all window are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
