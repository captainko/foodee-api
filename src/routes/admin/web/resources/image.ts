import { Image } from '../models';
import AdminBro, { BaseRecord } from 'admin-bro';
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
        },
      },
      // image: {
      //   components: {

      //   }
      // },

    },
    actions: {
      // new: {
      //   after: uploadFile,
      //   hand
      // },
      edit: {
        after: uploadFile,
        handler: (res, req, data) => ({record: data.record.toJSON()})
      },
    }
  }
};

async function uploadFile(res, req, ctx, ) {
  const { record } = ctx;
  const { payload } = req;
  const result = {};
  if (req.method === 'post') {

    if (record.isValid() && payload.file) {
      const { file } = payload;
      console.warn('lol');
      console.log(file);

      
      // here is the logic for uploading to S3 (in our case) - but you also can write this to
      // hdd or whatever else... file is a formidable object
      // const photo = await service.findAndUpdateFileInfo(+record.id(), file);

      return { ...res, record: record.toJSON() };
    }
  }
  if (req.method === 'get') {
    return {  record: record.toJSON() };

  }
  return '';
}