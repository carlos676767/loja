"use strict";
const path = require(`path`);
class Multer {
  static #multer = require(`multer`);
  static #uuid = require(`uuid`);
  static fs = require(`fs`);
  static multerConfig() {
    const storage = this.#multer.diskStorage({
      destination: (req, file, callback) => {
        const path = `C://Users//Administrator//Desktop//loja//backend//uploads//image`;
        callback(null, path);
      },

      filename: (req, file, callback) => {
        callback(null, file.originalname);
      },
    });

    return this.#multer({ storage: storage, fileFilter: this.fileFilter });
  }

  static fileFilter(req, file, callback) {
    const extname = path.extname(file.originalname);

    const extensionsImagesPertimidas = [
      ".jpeg",
      ".jpg",
      ".png",
      "mp4",
      "mov",
      "avi",
    ];

    if (!extensionsImagesPertimidas.includes(extname)) {
      return callback(
        new Error(
          "An error occurred while uploading the image. Please make sure the image is in the correct format (.jpg, .jpeg, .png) and try again."
        )
      );
    }

    const sizeLimit = 20 * 1024 * 1024;

    if (file.size > sizeLimit) {
      callback(new Error(`File size exceeds the 20MB limit`));
    }

    callback(null, true);
  }
}

module.exports = Multer