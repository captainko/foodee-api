import crypto = require('crypto');

import { User } from '../models';
import AdminBro from 'admin-bro';
import cloudinary = require("cloudinary");
import { Image } from '../../../../models';

export const UserResource = {
  resource: User,
  options: {
    name: 'Users',
    properties: {
      // publicId: {
      //   list: false,
      //   edit: false,
      //   filter: false,
      //   show: false,
      // },
      username: {
        isTitle: true,
      },
      password: {
        type: 'string',
        isVisible: {
          list: false,
          edit: true,
          filter: false,
          show: false,
        },
        position: 4,
      },
      hash: {
        isVisible: {
          list: false,
          edit: false,
          filter: false,
          show: false,
        }
      },
      salt: {
        isVisible: {
          list: false,
          edit: false,
          filter: false,
          show: false,
        }
      },
      ratings: {
        isVisible: {
          list: false,
          edit: false,
          filter: false,
          show: false,
        }
      },
      image_url: {
        components: {
          new: AdminBro.bundle('../components/images/ImageInEdit'),
          edit: AdminBro.bundle('../components/images/ImageInEdit'),
          list: AdminBro.bundle('../components/user/UserImageInList'),
          show: AdminBro.bundle('../components/user/UserImageInShow'),
        }
      }
    },
    actions: {
      new: {
        before: async (req) => {
          console.log(req);
          if (req.method === 'post') {
            if (req.payload.password) {
              const salt = crypto.randomBytes(16).toString('hex');
              // tslint:disable:max-line-length
              const hash = crypto.pbkdf2Sync(req.payload.password, salt, 10000, 512, 'sha512').toString('hex');

              req.payload = {
                ...req.payload,
                salt,
                hash,
                password: undefined,
              };
            }

            const { savedRecipes, ratings } = req.payload;
            // if (!savedRecipes.length) {
            //   savedRecipes = null;
            // }
            if (typeof savedRecipes != 'undefined' && !savedRecipes.length) {
              // savedRecipes = null;

              req.payload.savedRecipes = [];
            }
            if (typeof ratings != 'undefined' && !ratings.length) {

              req.payload.ratings = [];
            }

            const {file} = req.payload; 
            if (file) {
              const uploaded = await cloudinary.v2.uploader.upload(file.path, {
                use_filename: false,
                folder: 'foodee',
                unique_filename: true,
              });
              const image =  await Image.create({url: uploaded.secure_url,  publicId: uploaded.public_id, type: 'profile'});
              req.payload.image_url = image.id;
              
            }
          }
          console.log('called');
          return req;
        }
      },
      edit: {
        before: async (req) => {
          if (req.method === 'post') {
            if (req.payload.password) {
              const salt = crypto.randomBytes(16).toString('hex');
              // tslint:disable:max-line-length
              const hash = crypto.pbkdf2Sync(req.payload.password, salt, 10000, 512, 'sha512').toString('hex');
              req.payload = {
                ...req.payload,
                salt,
                hash,
                password: undefined,
              };
            }

            let { savedRecipes, ratings } = req.fields;
            if (typeof savedRecipes != 'undefined' && !savedRecipes.length) {
              // savedRecipes = null;

              req.fields.savedRecipes = [];
              req.payload.savedRecipes = [];
            }
            if (typeof ratings != 'undefined' && !ratings.length) {
              ratings = null;

              req.fields.ratings = [];
              req.payload.ratings = [];
            }

            const {file} = req.payload; 
            if (file) {
              const uploaded = await cloudinary.v2.uploader.upload(file.path, {
                use_filename: false,
                folder: 'foodee',
                unique_filename: true,
              });
              let image =  await Image.findOneAndUpdate({_id: req.payload.image_url}, {url: uploaded.secure_url,  publicId: uploaded.public_id, type: 'profile'});
              if (!image) {
                image = await Image.create({url: uploaded.secure_url, publicId: uploaded.public_id, type: 'profile'});
              }
              req.payload.image_url = image.id;
              
            }
          }
          return req;
        }
      }
    }
  },
};