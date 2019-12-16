import * as React from 'react';
// import { Label } from "admin-bro";

const USER_IMAGE = "https://ccivr.com/wp-content/uploads/2019/07/empty-profile.png";

const UserImageInList = function(props) {
  // console.log(props.record.);
  const { image_url } = props.record.populated;

  // tslint:disable-next-line: max-line-length
  if (image_url) {
    const {url} = image_url.params;
    return (
      <img
        src={url}
        style={styles.profileImage}
      />
    );
  }

  return (
    <img
      src={USER_IMAGE}
      style={styles.profileImage}
    />
  );
};

const styles = {
  profileImage: {
    width: '100px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  }
};

// AdminBro.UserComponents['MyComponentName'] = MyComponent
export default UserImageInList;