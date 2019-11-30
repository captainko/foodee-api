// lib
import express = require("express");
import mongoose = require("mongoose");

// app
import {
  DB_URI,
  IS_PROD,
} from "./environment";

import "./config";
import { Routes } from "./routes";
import middleware from "./middleware";
import { applyMiddleware } from "./util";
import { errorHandlers } from "./middleware/errorHandlers";
import admin from "./admin";

class App {
  public app: express.Application;
  public routePrv = Routes;
  public mongoUrl: string = DB_URI;
  constructor() {
    this.app = express();
    this._config();
    this._mongoSetup();
  }

  private _config() {

    applyMiddleware(middleware, this.app);
    this.routePrv.routes(admin);
    this.routePrv.routes(this.app);
    applyMiddleware(errorHandlers, this.app);
  }
  
  private _mongoSetup() {
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
