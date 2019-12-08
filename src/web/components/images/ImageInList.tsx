
import React from 'react';
const ImageInShow = (props) => {
  const { url } = props.record.params;
  return (<img style={{ width: '100px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} src={url} />);
};

// AdminBro.UserComponents['MyComponentName'] = MyComponent
export default ImageInShow;