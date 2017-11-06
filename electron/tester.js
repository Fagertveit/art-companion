const path = require('path');
const list = require('./list-library.js');

var currentDir = path.resolve(__dirname);

list.listFileSystem(currentDir, (err, fileListing) => {
  if (err) {
    console.error(err);
  } else {
    console.log(fileListing);
  }
});
