import React from 'react';

const Image = ({ image }) => {
  return (
    <div className="file-item">
      <img alt={`img - ${image.id}`} src={image.src} className="file-img" />
    </div>
  );
}

const ImageList = ({ images }) => {
  const renderImage = (image) => {
    return (
      <Image
        image={image}
        key={`${image.id}-image`}
      />
    );
  }
return <section className="file-list">{images.map(renderImage)}</section>
}

export default ImageList;