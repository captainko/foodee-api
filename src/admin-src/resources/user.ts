import crypto = require('crypto');

import {User } from '../models';

export const UserResource = {
  resource: User,
  options: {
    name: 'Users',
    properties: {
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
      }
    },
    actions: {
      new: {
        before: async (req) => {
          console.log(req);
          if (req.method === 'post') {
            if (req.payload.record.password) {
              const salt = crypto.randomBytes(16).toString('hex');
              // tslint:disable:max-line-length
              const hash = crypto.pbkdf2Sync(req.payload.record.password, salt, 10000, 512, 'sha512').toString('hex');
              req.payload.record = {
                ...req.payload.record,
                salt,
                hash,
                password: undefined,
              };
            }
          }
          return req;
        }
      },
      edit: {
        before: async (req, res, data) => {
          if (req.method === 'post') {
            console.log(req, res, data);
            if (req.payload.record.password) {
              const salt = crypto.randomBytes(16).toString('hex');
              // tslint:disable:max-line-length
              const hash = crypto.pbkdf2Sync(req.payload.record.password, salt, 10000, 512, 'sha512').toString('hex');
              req.payload.record = {
                ...req.payload.record,
                salt,
                hash,
                password: undefined,
              };
            }
          }
          return req;
        }
      }
    }
  },
};