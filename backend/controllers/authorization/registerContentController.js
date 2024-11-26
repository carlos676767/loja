"use strict";
class Multer {
  static #multer = require(`multer`);
  static #uuid = require(`uuid`);
  static #path = require(`path`);
  static multerConfig() {
    const storage = this.#multer.diskStorage({
      destination: (req, file, callback) => {
        const path = `C://Users//Administrator//Desktop//loja//backend//uploads//image`;
        callback(null, path);
      },

      filename: (req, file, file) => {
        file(null, this.#uuid.v7().concat(this.#path.extname(file.originalname)));
      },
    });

    return this.#multer({ storage: storage, 
      fileFilter: (req, file, callback) => {
        this.verifyImagExtename(req, file, callback)
        this.verifyImageSize(req, file, callback)
    } });
  }

  static verifyImagExtename(req, file, callback) {
    const extname = this.#path.extname(file);

    const extensionsImagesPertimidas = [".jpeg", ".jpg", ".png"];

    if (!extensionsImagesPertimidas.includes(extname)) {
      callback( new Error( "An error occurred while uploading the image. Please make sure the image is in the correct format (.jpg, .jpeg, .png) and try again.",false   ));
    }

    callback(null, true);
  }


  static verifyImageSize(req, file, callback){
    const sizeLimit = 20 * 1024 * 1024;

    if (file.size > sizeLimit) {
      callback(new Error(`File size exceeds the 20MB limit.`, false))
    }

    callback(null, true)
  }
}

class SetContents {
  static sqlLite = require(`../../db/database`)
  static async router(req, res){
    try {
      const {conteudo} = req.body
      const file = req.file

      SetContents.validacoes(conteudo, file)
      await SetContents.dbExecDados(file, conteudo, res)
    } catch (error) {
      res.status(400).send({msg: error.message})
    }
  }


  static getDate(){
    const agora = new Date()
    return `${agora.getMonth() + 1}/${agora.getDate()}/${agora.getFullYear()}`
  }



  static validacoes(conteudo, file){
    if (!conteudo) {
      throw new Error(`please send the content`)
    }


    if (typeof conteudo != `string`) {
      throw new Error("O conteúdo enviado está inválido. Por favor, envie um texto válido.");
    }


    if (!file) {
      throw new Error("No file uploaded.");
    }

    const sizeLimitCaracter = 50
    if (conteudo.length < sizeLimitCaracter) {
      throw new Error(`content must be longer than 50 characters`)
    }


  }


  static async dbExecDados(imgname, conteudo, res){
    const db = await this.sqlLite.db()
    try {
      await db.exec(`BEGIN TRANSACTION`)
      const query = `INSERT INTO CONTEUDO(DATACONTEUDO, NOME_IMG, CONTEUDO) VALUES(?, ?, ?)`

      await db.run(query, [this.getDate(), imgname, conteudo])

      await db.exec(`COMMIT`)

      res.status(201).send({msg: `content successfully registered`})
    } catch (error) {
      await db.exec(`ROLLBACK`)
      throw new Error("An error occurred while registering content, please try again.");
    }finally{
      await db.close()
    }
  }
}


module.exports = {SetContents, Multer}