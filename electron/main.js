const electron = require('electron');
// Module to control application life.
const app = electron.app;
const clipboard = electron.clipboard;
const dialog = electron.dialog;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Module for file download
const download = require('electron-dl');
// File system
const fs = require('fs');
// Path helper
const path = require('path');
// url to base64
const base64Img = require('base64-img');
// Local shortcut electron module
const localShortcut = require('electron-localshortcut');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600
  });

  mainWindow.setMenu(null);

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });

  // Register ipc listeners
  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
    console.log('Wants to navigate to ' + url);

    if (url.match('file:///')) {
      let path = url.substr(8, url.length);
      let filename = path.parse(url).fileName;

      base64Img.base64(path, (err, data) => {
        mainWindow.webContents.send('import-resource', { url: url, base64: data, filename: filename});
      });
    } else {
      let filename = url.split('/').pop();

      base64Img.requestBase64(url, (err, res, body) => {
        mainWindow.webContents.send('import-respurce', { url: url, base64: body, filename: filename });
      });
    }
  });

  electron.ipcMain.on('save-resource', (event, data) => {
    console.log('Save resource', app.getAppPath() + '\\' + data.category, data.filename);

    base64Img.img(data.base64, app.getAppPath() + '\\library\\' + data.category, data.filename, (err, path) => {
      let relative = path.relative(app.getAppPath(), path);
      console.log('Resource saved: ', path, relative);
      mainWindow.webContents.send('resource-saved', relative);
    });
  });

  electron.ipcMain.on('select-library', (event, data) => {
    let options = {
      title: 'Select library location',
      message: 'Please specify which path you want to use as your library path, library path should always have the pattern "library/[CATEGORIES]".',
      buttonLabel: 'Select library',
      properties: ['openDirectory']
    }

    dialog.showOpenDialog(options, (path) => {
      let relative = path.relative(app.getAppPath(), path);

      console.log('Changed library path to: ', path, relative);

      mainWindow.webContents.send('set-library-path', relative);
    });
  });

  // Register local shortcuts
  localShortcut.register('CommandOrControl+V', () => {
    let img = clipboard.readImage('PNG').toDataURL();
    let filename = 'clipboard-' + Date.now() + '.png';

    mainWindow.webContents.send('import-resource', { url: filename, base64: img, filename: filename });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
