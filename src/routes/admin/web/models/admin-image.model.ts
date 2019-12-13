import { Schema, model, Document, Model, SchemaDefinition } from 'mongoose';

type ImageType = 'profile' | 'recipe';

export interface IAdminImage extends Document {
  publicId: string;
  url: string;
  type: ImageType;
  toEditObject(): IAdminImage;
}

export const AdminImageFields: SchemaDefinition = {
  publicId: {
    type: String,
  },
  url: {
    type: String,
    required: [true, 'is required'],
  },
  type: {
    type: String,
    enum: ['profile', 'recipe'],
    required: true,
  }
};

export const AdminImageSchema = new Schema(AdminImageFields,
  //  {
  // versionKey: false,
  // timestamps: true,
  // toJSON: {
  //   virtuals: true,
  //   transform: (doc, ret) => {
  //     // delete ret._id;
  //     delete ret.publicId;
  //     delete ret.createdAt;
  //     delete ret.updatedAt;
  //     delete ret.type;
  //   }
  // },
  // toObject: {
  //   virtuals: true,
  //   transform: (doc, ret) => {
  //     delete ret._id;
  //     delete ret.publicId;
  //     delete ret.type;
  //     delete ret.createdAt;
  //     delete ret.updatedAt;
  //   }
  // },
// }
);

// AdminImageSchema.methods.toJSON = function(this: IImage) {
//   return this.url;
// };

// AdminImageSchema.methods.toEditObject = function(this: IImage) {
//   return {
//     ...this.toObject(),
//   };
// };

export interface IAdminImageModel extends Model<IAdminImage> {
  checkImagesExist: (images: string[]) => Promise<boolean>;
}

AdminImageSchema.statics.checkImagesExist = async function(this: IAdminImage, images: string[]) {
  const imgDocs = await Promise.all(images.map(i => AdminImageModel.findById(i)));
  if (imgDocs.includes(null)) {
    return false;
  }
  return true;
};
export const AdminImageModel = model<IAdminImage, IAdminImageModel>('admin-image', AdminImageSchema, 'images');

export { AdminImageModel as AdminImage };