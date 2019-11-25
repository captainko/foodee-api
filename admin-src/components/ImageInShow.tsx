
import React from 'react';
import { PropertyInShow, Label } from "admin-bro";

const ImageInShow = (props) => {
  const { url } = props.record.params;
  console.log(props);
  
  return (
    <>
    <Label>Image</Label>
    <img src={url} />
    </>
  );
};

// AdminBro.UserComponents['MyComponentName'] = MyComponent
export default ImageInShow;