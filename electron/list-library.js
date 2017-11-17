const fs = require('fs');
const path = require('path');
const glob = require('glob');
const async = require('async');
const nativeImage = require('electron').nativeImage;

exports.getFileList = function(basePath, cb) {
  glob(basePath + '/**/*.+(jpg|png|jpeg)', null, (err, files) => {
    if (err) {
      return cb(err);
    }

    return cb(null, files);
  });
}

exports.getFileInfo = function(file, cb) {
  let sections = file.split('/');
  let parsed = path.parse(file);
  let fileObj = {
    filename: '',
    category: '',
    destination: '',
    dimensions: {},
    size: 0,
    url: '',
    format: '',
    tags: []
  };
  //fileObj.size = fs.statSync(file).size;

  sections = sections.slice(sections.indexOf('library') + 1)

  fileObj.category = sections.shift();
  fileObj.filename = sections.pop();

  let tagBase = '';

  for (let tag of sections) {
    let tempTag = {
      _id: '',
      parentCategory: '',
      parentTag: '',
      title: ''
    };

    tempTag.title = tag;

    if (tagBase.length == 0) {
      tempTag._id = fileObj.category.toLowerCase().replace(' ', '_') + '-' + tag.toLowerCase().replace(' ', '_');
      tempTag.parentCategory = fileObj.category.toLowerCase().replace(' ', '_');
      tagBase = fileObj.category.toLowerCase().replace(' ', '_') + '-' + tag.toLowerCase().replace(' ', '_');
    } else {
      tempTag._id = tagBase + '-' + tag.toLowerCase().replace(' ', '_');
      tempTag.parentTag = tagBase;
      tagBase += '-' + tag.toLowerCase().replace(' ', '_');
    }

    fileObj.tags.push(tempTag);
  }

  fileObj.destination = 'library' + '/' + fileObj.category + '/' + sections.join('/') + fileObj.filename;
  fileObj.url = file;
  fileObj.format = parsed.ext;

  cb(null, fileObj);
}

exports.listFileSystem = function(basePath, cb) {
  glob(basePath + '/**/*.+(jpg|png|jpeg|gif)', null, (err, files) => {
    if (err) {
      return cb(err, {});
    }

    let fileListing = {};

    async.eachOfLimit(files, 100, (file, key, callback) => {
      let sections = file.split('/');
      let parsed = path.parse(file);
      let fileObj = {
        filename: '',
        category: '',
        destination: '',
        dimensions: {},
        size: 0,
        url: '',
        format: '',
        tags: []
      };
      //fileObj.size = fs.statSync(file).size;

      sections = sections.slice(sections.indexOf('library') + 1)

      fileObj.category = sections.shift();
      fileObj.filename = sections.pop();

      let tagBase = '';

      for (let tag of sections) {
        let tempTag = {
          _id: '',
          parentCategory: '',
          parentTag: '',
          title: ''
        };

        tempTag.title = tag;

        if (tagBase.length == 0) {
          tempTag._id = fileObj.category.toLowerCase().replace(' ', '_') + '-' + tag.toLowerCase().replace(' ', '_');
          tempTag.parentCategory = fileObj.category.toLowerCase().replace(' ', '_');
          tagBase = fileObj.category.toLowerCase().replace(' ', '_') + '-' + tag.toLowerCase().replace(' ', '_');
        } else {
          tempTag._id = tagBase + '-' + tag.toLowerCase().replace(' ', '_');
          tempTag.parentTag = tagBase;
          tagBase += '-' + tag.toLowerCase().replace(' ', '_');
        }

        fileObj.tags.push(tempTag);
      }

      fileObj.destination = 'library' + '/' + fileObj.category + '/' + sections.join('/') + fileObj.filename;
      fileObj.url = file;
      fileObj.format = parsed.ext;

      if (!fileListing[fileObj.category]) {
        fileListing[fileObj.category] = [];
      }

      fileListing[fileObj.category].push(fileObj);

      callback();
    }, (err) => {
      if (err) {
        return cb(err);
      }

      cb(null, fileListing);
    });
  });
}
