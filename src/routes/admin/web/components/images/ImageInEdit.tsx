import React, { FC } from 'react';
import { unflatten } from 'flat';

import { BasePropertyProps, DropArea, PropertyInEdit } from 'admin-bro';

export const MIME_TYPES = ['image/jpeg', 'image/gif', 'image/tiff', 'image/png'];
export const MAX_SIZE = 1024 * 5000; // 5 MB;

const EditImageProperty: FC<BasePropertyProps> = ({ property, record, onChange }) => {
  const params: any = unflatten(record.params);

  const fileObject = params.filename ? {
    name: params.filename,
    size: params.size,
    type: params.mimeType,
    file: params.file,
  } : null;

  const onUpload = (files): void => {
    const newRecord = { ...record };
    const [file] = files;
    onChange({
      ...newRecord,
      params: {
        ...newRecord.params,
        file,
        filename: file.name,
        size: file.size,
        mimeType: file.type,
      },
    });
  };

  return (
    <PropertyInEdit property={property}>
      <DropArea
        fileObject={fileObject}
        onUpload={onUpload}
        propertyName={property.name}
        validate={{
          mimeTypes: MIME_TYPES,
          maxSize: MAX_SIZE,
        }}
      />
    </PropertyInEdit>
  );
};

export default EditImageProperty;