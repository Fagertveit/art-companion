const path = require('path');
const importLibrary = require('./import-library');

let resourceCount;
let libPath;

function testImport(libraryPath) {
  libPath = libraryPath;

  importLibrary.startImport(libraryPath, (err, numResources) => {
    if (err) {
      console.error(err.message);
    }

    console.log(numResources);

    resourceCount = numResources;

    takeNext();
  });
}

function takeNext() {
  importLibrary.takeNext(libPath, (err, fileInfo) => {
    if (err) {
      console.error(err.message);
    }

    console.log('File imported: ' + fileInfo.filename + ' Category: ' + fileInfo.category);

    resourceCount -= 1;

    if (resourceCount > 0) {
      takeNext();
    }
  });
}

testImport(process.argv[2]);
