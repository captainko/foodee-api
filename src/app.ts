// lib
import * as express from "express";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as logger from "morgan";
import * as errorHandler from "errorhandler";


// app
import "./config";
import {
  DB_URI,
  IS_PROD,
  SESSION_SECRET
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

  private _addErrorHandlers() {
    /// catch 404 and forward to error handler
    this.app.use((req, res, next) => {
      var err = new Error('Not found') as any;
      err.status = 404;
      next(err);
    });

    if (!IS_PROD) {
      // this.app.use(errorHandler());

      this.app.use((err, req, res, next) => {
        console.log(err.stack);

        res.status(err.status || 500);
        res.json({
          'errors': {
            message: err.message,
            error: err
          }
        });
      });
    }

  }
}

export default new App().app;
