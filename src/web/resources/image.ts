import {Image} from '../models';
import AdminBro from 'admin-bro';
export const ImageResource = {
  resource: Image,
  options: {
    name: 'Images',
    properties: {
      url: {
        components: {
          show: AdminBro.bundle('../components/images/ImageInShow'),
          // list: AdminBro.bundle('../components/images/ImageInList'),
        }
      }
    }
  }
};
