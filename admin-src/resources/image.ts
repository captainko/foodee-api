import {Image} from '../models';
export const ImageResource = {
  resource: Image,
  options: {
    name: 'Images',
    properties: {
      url: {
        type: 'image'
      }
    }
  }
};