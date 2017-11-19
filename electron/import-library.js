const path = require('path');
const glob = require('glob');
const fs = require('fs');
const fsExtra = require('fs-extra');
const nativeImage = require('electron').nativeImage;
const base64Img = require('base64-img');

module.exports = {
  gFileList: [],

  startImport: function(libraryPath, callback) {
    this.getFileList(libraryPath, (err, fileList) => {
      if (err) {
        return callback(err);
      }

      this.gFileList = fileList;

      callback(null, fileList.length);
    });
  },

  takeNext: function(libraryPath, callback) {
    let file = this.gFileList.pop();

    this.generateFileData(file, libraryPath, (err, fileInfo) => {
      if (err) {
        callback(err);
      }

      callback(null, fileInfo);
    });
  },

  getFileList: function(libraryPath, callback) {
    glob(libraryPath + '/**/*.+(jpg|png|jpeg)', null, (err, files) => {
      if (err) {
        return callback(err);
      }

      return callback(null, files);
    });
  },

  generateFileData: function(file, libraryPath, callback) {
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

    sections = sections.slice(sections.indexOf('library') + 1);

    fileObj.category = sections.shift();
    fileObj.filename = sections.pop();
    fileObj.size = fs.statSync(file).size;

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

    callback(null, fileObj);
  },

  generateThumbnail: function(url, id, libraryPath, sizeBase, quality, callback) {
    let srcImage = nativeImage.createFromPath(url);
    let srcSize = srcImage.getSize();
    let thumbPath = path.resolve(libraryPath, 'thumbnails');
    let options = {
      quality: quality
    };

    if (srcSize.width < srcSize.height) {
      options.height = sizeBase;
    } else {
      options.width = sizeBase;
    }

    let thumbnail = srcImage.resize(options);

    base64Img.img(thumbnail.toDataURL(), thumbPath, id, (err, imgPath) => {
      if (err) {
        callback(err);
      }

      callback(null, { url: imgPath, size: srcSize });
    });
  },

  moveFile: function(src, dest, destDir, callback) {
    fsExtra.ensureDir(destDir).then(() => {
      fsExtra.move(src, dest).then(() => {
        callback();
      }).catch((err) => {
        callback(err);
      })
    }).catch((err) => {
      callback(err);
    });
  }
}
