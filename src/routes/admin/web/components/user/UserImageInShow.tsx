import * as React from 'react';

import { Label } from "admin-bro";

const UserImageInShow = (props) => {
  const { url } = props.record.populated.image_url.params;
  console.log(props);

  return (
    <>
      <Label>Image</Label>
      <img style={{height: '100px'}} src={url} />
    </>
  );
};

// AdminBro.UserComponents['MyComponentName'] = MyComponent
export default UserImageInShow;