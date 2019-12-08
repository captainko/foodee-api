import {Image} from '../models';
import AdminBro from 'admin-bro';
export const ImageResource = {
  resource: Image,
  options: {
    name: 'Images',
    properties: {
      url: {
        position: 1,
        // isTitle: true,
        components: {
          show: AdminBro.bundle('../components/images/ImageInShow'),
          list: AdminBro.bundle('../components/images/ImageInList'),
        }
      },
      publicId: {
        position: 0,
        isTitle: true,
      }
    }
  }
};
