// lib
import express = require("express");
import expressLayouts = require("express-ejs-layouts");
import mongoose = require("mongoose");
import AdminBro from "admin-bro";
import AdminBroExpress = require('admin-bro-expressjs');
import path = require('path');

// app
import {
  DB_URI,
  IS_PROD,
} from "./environment";

import { UserResource, ImageResource, RecipeResource, RatingResource, RatingResultResource, CollectionResource } from './web/resources';
import { UserModel, RatingResultModel } from "./models";
import { resetPassword } from "./routes/reset-password.router";
AdminBro.registerAdapter(require('admin-bro-mongoose'));

class Admin {
  public app: express.Application;
  constructor() {
    this.app = express();
    this._config();
    // this._mongoSetup();
  }

  private _config() {

    // Passing resources by giving entire database
    const adminBro = new AdminBro({
      // databases: [mongooseDb],
      resources: [
        UserResource,
        ImageResource,
        RecipeResource,
        RatingResource,
        RatingResultResource,
        CollectionResource,
      ]
      // ... other AdminBroOptions
    });

    const adminRouter = AdminBroExpress.buildAuthenticatedRouter(adminBro,
      {
        authenticate: async (email, password) => {
          const user = await UserModel.findOne({ email });
          if (user && user.admin) {
            const matched = user.validPassword(password);
            if (matched) {
              return user;
            }
          }
          return false;
        },
        cookiePassword: 'some-secret-password-used-to-secure-cookie',
      }
    );
    // const AdminRouter = AdminBroExpress.buildRouter(adminBro);
    console.log(adminBro.options.rootPath);
    
    const staticFolder = IS_PROD ? 'dist' : 'public';
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'ejs');
    this.app.use(express.static(path.join(__dirname, staticFolder)));
    this.app.use(expressLayouts);
    this.app.use(adminBro.options.rootPath, adminRouter);
    this.app.use(resetPassword);
    this.app.use((req, res) => {
      res.status(404).render('pages/404');
    });
    // Passing resources one by one
    // const AdminBro = new AdminBro({
    //   resources: [User, Admin],
    //   // ... other AdminBroOptions
    // });

  }

  private async _mongoSetup() {
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    if (!IS_PROD) {
      mongoose.set('debug', true);
    }

    try {
      return await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
      console.log(err);
    }

  }
}

export default new Admin().app;
