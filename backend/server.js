import middlare from './middleware/multerMiddlare.js';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './configSwagger.js';
import routerApi from './routers/router.js';

dotenv.config()


class Api {
  static #express = express;
  static #port = process.env.PORT || 8080;

  static #configExpres() {
    const api = this.#express();
    api.listen(this.#port, () => {
      console.log(`server running on port ${this.#port}`);
    });

    
    return api;
  }

  static routersApi() {
    const myApi = this.#configExpres();
    myApi.use(bodyParser.json());
    myApi.use(cors());
    myApi.use(this.#express.static('public'));
    myApi.use(this.#express.static('uploads/image'));
    myApi.use(routerApi);
    myApi.use(middlare);
    myApi.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    myApi.set('view engine', 'pug');
  }
}

Api.routersApi();