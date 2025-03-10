




export const getImageUrl = (path) => {


    if (!path) {
      console.error('Error: Path is undefined or empty');
      return '';
    }
    console.log('Generated URL + get the image success:', `/assets/${path}`);
    return `/assets/${path}`; // Static URL resolution
  };

