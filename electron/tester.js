const path = require('path');
const list = require('./list-library');

list.listFileSystem(process.argv[2], (err, fileListing) => {
  if (err) {
    console.error(err);
  } else {
    console.log(fileListing);
  }
});
