const electron = require('electron');
// Module to control application life.
const app = electron.app;
const clipboard = electron.clipboard;
const dialog = electron.dialog;
const nativeImage = electron.nativeImage;
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
const importLib = require('./import-library');
// regex for supported image formats
const fileMatch = /(.jpg|.png|.gif|.jpeg|.svg)/gi;
const async = require('async');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let libraryPath = app.getAppPath() + path.sep + 'assets' + path.sep + 'library';
let numImportResource = 0;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
      width: 1600,
      height: 900,
      minWidth: 1100,
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
      let filename = Date.now() + '-' + url.split(path.sep).pop();

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
      console.log('Resource saved: ', imgPath);
      let fileStats = fs.statSync(imgPath);
      let fileSize = fileStats.size;

      let srcImage = nativeImage.createFromPath(imgPath);
      let srcSize = srcImage.getSize();
      let parsedPath = path.parse(imgPath);
      let thumbPath = path.resolve(libraryPath, 'thumbnails');
      let options = {
        quality: 'good'
      };

      if (srcSize.width < srcSize.height) {
        options.height = data.sizeBase;
      } else {
        options.width = data.sizeBase;
      }

      let thumbnail = srcImage.resize(options);

      base64Img.img(thumbnail.toDataURL(), thumbPath, data.id, (err, thumbUrl) => {
        if (err) {
          console.error(err);
        }

        mainWindow.webContents.send('resource-created', { url: imgPath, thumbUrl: thumbUrl, imageSize: srcSize, fileSize: fileSize, fileFormat: parsedPath.ext });
      });
    });
  });

  electron.ipcMain.on('update-resource', (event, data) => {
    importLib.moveFile(data.src, data.dest, data.destDir, (err) => {
      if (err) {
        console.error(err);
      }

      mainWindow.webContents.send('resource-updated', { destination: data.dest });
    });
  });

  electron.ipcMain.on('generate-thumbnail', (event, data) => {
    async.waterfall([
      async.apply(generateThumbnail, data)
    ], (err, result) => {
      if (err) {
        console.error(err.message);
      }

      mainWindow.webContents.send('thumbnail-generated', result);
    });
  });

  electron.ipcMain.on('remove-resource', (event, src) => {
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
      mainWindow.webContents.send('set-library-path', { libraryPath: libPath[0] });
    });
  });

  electron.ipcMain.on('import-library', (event) => {
    importLib.startImport(libraryPath, (err, numResource) => {
      numImportResource = numResource;

      mainWindow.webContents.send('import-start', numResource);
    });
  });

  electron.ipcMain.on('import-take-next', (event) => {
    importLib.takeNext(libraryPath, (err, imageInfo) => {
      mainWindow.webContents.send('import-file-info', imageInfo);
    });
  });

  electron.ipcMain.on('import-thumbnail', (event, data) => {
    importLib.generateThumbnail(data.url, data.id, libraryPath, 400, 'good', (err, thumbData) => {
      mainWindow.webContents.send('imported-thumbnail', { url: thumbData.url, id: data.id, size: thumbData.size });
    });
  });

  electron.ipcMain.on('list-library', (event) => {
    importLibrary.listFileSystem(libraryPath, (err, result) => {
      if (err) {
        console.error(err);
      }

      mainWindow.webContents.send('library-listed', { fs: result });
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
function generateThumbnail(data, callback) {
  let srcImage = nativeImage.createFromPath(data.url);
  let srcSize = srcImage.getSize();
  let thumbPath = path.resolve(libraryPath, 'thumbnails');
  let options = {
    quality: 'good'
  };

  if (srcSize.width < srcSize.height) {
    options.height = data.sizeBase;
  } else {
    options.width = data.sizeBase;
  }

  let thumbnail = srcImage.resize(options);

  base64Img.img(thumbnail.toDataURL(), thumbPath, data.id, (err, imgPath) => {
    if (err) {
      console.error(err.message);
    }

    callback(null, { url: imgPath, size: srcSize, id: data.id})
  });
}
