const middlare = require('./middleware/multerMiddlare');

require('dotenv').config();

class Api {
  
  static #express = require(`express`);
  static #port = process.env.PORT || 8080;
  static bodyParser = require(`body-parser`);
  static routerApi = require("./routers/router");
  static swaggerUi = require('swagger-ui-express');
  static swaggerDocs = require(`./configSwagger`)
  static cors = require(`cors`);
  static #configExpres() {
    const api = this.#express();
    api.listen(this.#port, () => {
      console.log(`server running on port ${this.#port}`);
    });

    return api;

  }
  


  static routersApi() {
    const myApi = this.#configExpres();
    myApi.use(this.bodyParser.json());
    myApi.use(this.#express.static(`public`))
    myApi.use(this.#express.static(`uploads/image`))
    myApi.use(this.routerApi);
    myApi.use(this.cors());
    myApi.use(  middlare)
    myApi.use(`/doc`, this.swaggerUi.serve, this.swaggerUi.setup(this.swaggerDocs))

  }
}

Api.routersApi();
