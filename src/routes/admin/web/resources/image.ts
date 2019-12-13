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
        actions: {
          new: uploadFile,
          edit: uploadFile,
        }
      },
      // image: {
      //   components: {
         
      //   }
      // },

    }
  }
};

async function uploadFile(res, req, ctx, ) {
  const { record } = ctx;
  const { payload } = req;
  if (record.isValid() && payload.file) {
    const { file } = payload;

    // here is the logic for uploading to S3 (in our case) - but you also can write this to
    // hdd or whatever else... file is a formidable object
    const photo = await service.findAndUpdateFileInfo(+record.id(), file);

    return {
      ...res,
      record: new BaseRecord(photo, ctx.resource).toJSON(ctx.currentAdmin),
    };
  }
  return res;
}