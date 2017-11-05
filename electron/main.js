const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Module for file download
const download = require('electron-dl');
// File system
const fs = require('fs');
// Path helper
const path = require('path');
// url to base64
//const i2b = require("imageurl-base64");

const base64Img = require('base64-img');
// Module to recive messages from web app
//const ipcMain = require('electron');

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
  })
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

  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
    console.log('Wants to navigate to ' + url);

    if (url.match('file:///')) {
      var path = url.substr(8, url.length);

      base64Img.base64(path, (err, data) => {
        mainWindow.webContents.send('url-activated', JSON.stringify({ url: url, imgStr: data }));
      });
    } else {
      base64Img.requestBase64(url, (err, res, body) => {
        mainWindow.webContents.send('url-activated', JSON.stringify({ url: url, imgStr: body }));
      });
    }
    /*fs.readFile(path.normalize(url), (err, data) => {
      //error handle
      if (err) {
        console.error(err);
      }

      //get image file extension name
      let extensionName = path.extname(url);

      //convert image file to base64-encoded string
      let base64Image = new Buffer(data, 'binary').toString('base64');

      //combine all strings
      let imgSrcString = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;

      //send image src string into jade compiler
      mainWindow.webContents.send('url-activated', imgSrcString);
    })*/

    /*download.download(mainWindow, url).then(dl =>
      console.log(dl.getSavePath())
    ).catch(console.error);*/
  });

  electron.ipcMain.on('save-resource', (event, url) => {
    console.log('Save the resource', url);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
