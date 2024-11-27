"use strict";
const path  = require(`path`);
class Multer {
  static #multer = require(`multer`);
  static #uuid = require(`uuid`);
  static fs = require(`fs`)
  static multerConfig() {
    const storage = this.#multer.diskStorage({
      destination: (req, file, callback) => {
        const path = `C://Users//Administrator//Desktop//loja//backend//uploads//image`;
        callback(null, path);
      },

      filename: (req, file, callback) => {
        callback(null,file.originalname)
      },
    });

    return this.#multer({ storage: storage, fileFilter:   this.fileFilter } );
  }

  static fileFilter(req, file, callback) {
    const extname = path.extname(file.originalname);
  
    const extensionsImagesPertimidas = [".jpeg", ".jpg", ".png", "mp4", "mov", "avi"];

    if (!extensionsImagesPertimidas.includes(extname)) { 
    
    return  callback( new Error( "An error occurred while uploading the image. Please make sure the image is in the correct format (.jpg, .jpeg, .png) and try again."   ));
    }


    const sizeLimit = 20 * 1024 * 1024;

    if (file.size > sizeLimit) {
      
      callback(new Error(`File size exceeds the 20MB limit`))
    }


    callback(null, true);

  }
}



class RegisterContentController {
  static sqlLite = require(`../../db/database`)
  static async router(req, res){
    try {
      const {conteudo, preco_conteudo} = req.body
      console.log(conteudo);
      
      const file = req.file.originalname
      console.log(file);
      

      RegisterContentController.validacoes(conteudo, file)
      await RegisterContentController.dbExecDados(file, conteudo, res,preco_conteudo)
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


    const sizeLimitCaracter = 20
    if (conteudo.length < sizeLimitCaracter) {
      throw new Error(`content must be longer than 20 characters`)
    }


  }


  static async dbExecDados(imgname, conteudo, res, PRECO_CONTEUDO){
    const db = await this.sqlLite.db()
    try {
      await db.exec(`BEGIN TRANSACTION`)
      const query = `INSERT INTO CONTEUDO(DATACONTEUDO, NOME_IMG, CONTEUDO, PRECO_CONTEUDO) VALUES(?, ?, ?, ?)`

      await db.run(query, [this.getDate(), imgname, conteudo, PRECO_CONTEUDO])

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

module.exports = {
  Multer,
  RegisterContentController
}

