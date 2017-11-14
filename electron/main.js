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
// File structure importer
const importLibrary = require('./list-library');
// regex for supported image formats
const fileMatch = /(.jpg|.png|.gif|.jpeg|.svg)/gi;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let libraryPath = app.getAppPath() + '\\assets\\library\\';

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
      width: 1600,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      backgroundColor: '#262427'
  });

  mainWindow.setMenu(null);

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Register ipc listeners
  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
    console.log('Wants to navigate to ' + url);

    if (!url.match(fileMatch)) {
      mainWindow.webContents.send('import-failed', 'Cannot import image data from url: ' + url);
      return console.error('Unsupported image format', url);
    }

    if (url.match('file:///')) {
      let imgPath = url.substr(8, url.length).replace('%20', ' ');
      let filename = Date.now() + '-' + path.parse(url).base;

      base64Img.base64(imgPath, (err, data) => {
        if (err) {
          return console.error(err);
        }

        mainWindow.webContents.send('import-resource', { url: url, base64: data, filename: filename});
      });
    } else {
      let filename = Date.now() + '-' + url.split('/').pop();
      console.log('Filename: ', filename);

      base64Img.requestBase64(url, (err, res, body) => {
        if (err) {
          return console.error(err);
        }

        mainWindow.webContents.send('import-resource', { url: url, base64: body, filename: filename });
      });
    }
  });

  electron.ipcMain.on('client-startup', (event, data) => {
    if (data.libraryPath) {
      libraryPath = data.libraryPath;
    }
  });

  electron.ipcMain.on('create-resource', (event, data) => {
    console.log('Save resource', path.resolve(libraryPath, data.category, data.tags, data.filename));

    base64Img.img(data.base64, path.resolve(libraryPath, data.category, data.tags), path.parse(data.filename).name, (err, imgPath) => {
      let relative = path.relative(app.getAppPath(), imgPath);
      console.log('Resource saved: ', imgPath, relative);
      mainWindow.webContents.send('resource-created', { url: imgPath, relativePath: relative });
    });
  });

  electron.ipcMain.on('update-resource', (event, data) => {
    console.log('Copy file ' + data.src + ' to ' + data.dest);

    fs.copyFile(data.src, data.dest, (err) => {
      mainWindow.webContents.send('resource-updated', { destination: data.dest });

      // Unlink src
      fs.unlink(data.src, (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
  });

  electron.ipcMain.on('remove-resource', (event, src) => {
    console.log('Unlinking file ' + src);

    fs.unlink(src, (err) => {
      if (err) {
        return console.error(err);
      }

      mainWindow.webContents.send('resource-removed');
    });
  });

  electron.ipcMain.on('select-library', (event, data) => {
    let options = {
      title: 'Select library location',
      message: 'Please specify which path you want to use as your library path, library path should always have the pattern "library/[CATEGORIES]".',
      buttonLabel: 'Select library',
      properties: ['openDirectory']
    }

    dialog.showOpenDialog(options, (libPath) => {
      let relative = path.relative(app.getAppPath(), libPath[0]);

      libraryPath = libPath[0];

      importLibrary.listFileSystem(libPath[0], (err, result) => {
        mainWindow.webContents.send('set-library-path', { fs: result, libraryPath: libPath[0] });
      });
    });
  });

  // Register local shortcuts
  localShortcut.register('CommandOrControl+V', () => {
    let img = clipboard.readImage('PNG').toDataURL();
    let filename = Date.now() + '-clipboard' + '.png';

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
