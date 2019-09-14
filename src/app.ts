// lib
import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as logger from "morgan";
// app
import { DB_URI } from "./environment";
import { Routes } from "./routes";

class App {
  public app: express.Application;
  public routePrv = Routes;
  public mongoUrl: string = DB_URI;
  constructor() {
    this.app = express();
    this._config();
    this.routePrv.routes(this.app);

    this._mongoSetup();
  }

  private _config() {
    // support application/json type post data
    this.app.use(bodyParser.json());
    // support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(logger("short"));
  }

  private _setupRoutes() {

  }

  private _mongoSetup() {
    // mongoose.Promise = global.Promise;
    mongoose.set('useCreateIndex', true);
    mongoose.connect(this.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log("Connected to db"))
      .catch((err) => console.log("Can't connect to db, ", err));
  }
}

export default new App().app;
