// lib
import * as express from "express";
import * as mongoose from "mongoose";


// app
import "./config";
import {
  DB_URI,
  IS_PROD,
} from "./environment";
import { Routes } from "./routes";
import middleware from "./middleware";
import { applyMiddleware } from "./util";
import { errorHandlers } from "./middleware/errorHandlers";

class App {
  public app: express.Application;
  public routePrv = Routes;
  public mongoUrl: string = DB_URI;
  constructor() {
    this.app = express();
    this._config();

    // this._addErrorHandlers();
    this._mongoSetup();
  }

  private _config() {

    express.response.sendAndWrap = function (obj) {
      return this.send({
        status: this.statusCode,
        data: obj
      });
    }
    applyMiddleware(middleware, this.app);
    this.routePrv.routes(this.app);
    applyMiddleware(errorHandlers, this.app);
  }


  private _setupRoutes() {

  }

  private _mongoSetup() {
    // mongoose.Promise = global.Promise;
    mongoose.set('useCreateIndex', true);
    mongoose.connect(this.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log("Connected to db"))
      .catch((err) => console.log("Can't connect to db, ", err));

    if (!IS_PROD) {
      mongoose.set('debug', true);
    }
  }
}

export default new App().app;
