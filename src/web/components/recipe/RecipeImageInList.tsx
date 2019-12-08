import React from 'react';
// import { Label } from "admin-bro";

const RecipeImageInList = function(props)  {
  // console.log(props.record.);
  const { url } = props.record.populated.image_url.params;
  // tslint:disable-next-line: max-line-length
  return (
    <img
      src={url}
      style={{ width: '100px', display: 'block', marginLeft: 'auto', marginRight: 'auto', }}
    />
  );
};

// AdminBro.UserComponents['MyComponentName'] = MyComponent
export default RecipeImageInList;