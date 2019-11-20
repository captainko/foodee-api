import { Schema, model, SchemaTypes, Document, Model } from 'mongoose';
import { HTTP404Error } from '../util/httpErrors';

type ImageType = 'profile' | 'recipe';

export interface IImage extends Document {
  publicId: string;
  url: string;
  type: ImageType;
}

export const ImageSchema = new Schema({
  publicId: {
    type: String,
    required: [true, 'is required'],
  },
  url: {
    type: String,
    required: [true, 'is required'],
  },
  type: {
    type: String,
    enum: ['profile', 'recipe'],
    required: true
  }
}, {
  versionKey: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret, op) => {
      delete ret._id;
      delete ret.publicId;
      delete ret.createdAt;
      delete ret.updatedAt;
      delete ret.type;
    } 
  },
  toObject: {
      virtuals: true,
      transform: (doc, ret) => {
      delete ret._id;
      delete ret.createdAt;
      delete ret.updatedAt;
    }
  },
});

export interface IImageModel extends Model<IImage> {
  checkImagesExists: (images: string[]) => Promise<IImage>;
}

ImageSchema.statics.checkImagesExist = async function(this: IImage, images: string[]) {
  const imgDocs = await Promise.all(images.map(i => ImageModel.findById(i)));
  if (imgDocs.includes(null)) {
    throw new HTTP404Error("Image not exists");
  }
  return imgDocs;
};
export const ImageModel = model<IImage, IImageModel>('image', ImageSchema);

export {ImageModel as Image};