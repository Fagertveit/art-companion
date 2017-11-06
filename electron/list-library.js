const fs = require('fs');
const path = require('path');
const glob = require('glob');

exports.listFileSystem = function(basePath, cb) {
  glob(basePath + '/**/*.+(jpg|png|jpeg|gif)', null, (err, files) => {
    if (err) {
      return cb(err, {});
    }

    let fileListing = {};

    for (let file of files) {
      let sections = file.split('/');
      let parsed = path.parse(file);

      let category = sections[sections.length - 2];
      let fileType = parsed.ext;
      let fileName = parsed.name;

      if (!fileListing[category]) {
        fileListing[category] = [];
      }

      fileListing[category].push({ fileName: fileName, fileType: fileType, path: file });
    }

    cb(null, fileListing);
  });
}
