import * as bodyParser from "body-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import { Routes } from "./routes/crmRoutes";
import * as logger from "morgan";


class App {
  public app: express.Application;
  public routePrv: Routes = new Routes();
  public mongoUrl: string = 'mongodb://localhost:27017/CRMdb';
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

  private _mongoSetup() {
    // mongoose.Promise = global.Promise;
    mongoose.connect(this.mongoUrl, { useNewUrlParser: true , useUnifiedTopology: true})
      .then(() => console.log("Connected to db"))
      .catch((err) => console.log("Can't connect to db, ", err));
  }
}
export default new App().app;
