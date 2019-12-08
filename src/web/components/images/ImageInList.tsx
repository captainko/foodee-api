
const React = require('react');
import { Label } from "admin-bro";

const ImageInList = (props) => {
  const { url } = props.record.params;
  return <><img style={{ width: '100px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} src={url} /></>;
};

// AdminBro.UserComponents['MyComponentName'] = MyComponent
export default ImageInList;