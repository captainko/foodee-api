// lib
import * as express from "express";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as logger from "morgan";
import * as errorHandler from "errorhandler";
// app
import {
  DB_URI,
  IS_PROD,
  SESSION_SECRET
} from "./environment";
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
    this.app.use(logger("dev"));
    this.app.use(session({
      secret: SESSION_SECRET,
      cookie: { maxAge: 60000 },
      resave: false,
      saveUninitialized: false,
    }));
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
      this.app.use(errorHandler());
      
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
