import { Image } from '../models';
import AdminBro, { BaseRecord } from 'admin-bro';
import cloudinary = require('cloudinary');
export const ImageResource = {
  resource: Image,
  options: {
    name: 'Images',
    properties: {
      url: {
        components: {
          show: AdminBro.bundle('../components/images/ImageInShow'),
          new: AdminBro.bundle('../components/images/ImageInEdit'),
          edit: AdminBro.bundle('../components/images/ImageInEdit'),
          list: AdminBro.bundle('../components/images/ImageInList'),
        },
      },
      // image: {
      //   components: {

      //   }
      // },

    },
    // actions: {
    //   new: {
    //     before: (req) => {
    //       if (!req.url) {
    //         req.url = '';
    //       }
    //       console.log(req);

    //       return req;
    //     },
    //     // handler: (res, req, data) => ({record: data.record.toJSON()}),
    //     // after: uploadFile,
    //   },
    //   edit: {
    //     handler: (res, req, data) => ({record: data.record.toJSON()}),
    //     after: uploadFile,
    //   },
    // }
  }
};

async function uploadFile(req) {

  if (req.method === 'post') {
    const {file} = req.params;
    if (req.params.file) {
      console.warn('lol');
      console.log(file);

      // here is the logic for uploading to S3 (in our case) - but you also can write this to
      // hdd or whatever else... file is a formidable object
      // const photo = await service.findAndUpdateFileInfo(+record.id(), file);
      try {
        const result = await cloudinary.v2.uploader.upload(file.path, {
          format: 'jpg',
          use_filename: false,
          folder: 'foodee',
        });

        const image = await Image.create({publicId: result.public_id, url: result.secure_url, type: 'recipe'});
        
      } catch (err) {
        console.log(err);
      }
      
    }
  }
  // if (req.method === 'get') {
    
  // }
  return {...res,  record: record.toJSON() };
}