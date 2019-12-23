import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const type = 'Image';

const Image = ({ image, index, moveImage }) => {
  const ref = useRef(null);
  // useDrop hook is responsible for handling whether any item gets hovered or dropped on the element
  const [, drop] = useDrop({
    accept: type,
        // This method is called when we hover over an element while dragging
    hover(item) {  // item is the dragged element

      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        console.log('debug cxi', 'drapIndex equals to hoverIndex', dragIndex);
        return;
      }
      console.log('debug cxi', 'dragIndex-id vs hoverIndex-id:', `${dragIndex}-${item.id}`, `${hoverIndex}-${image.id}`);
      moveImage(dragIndex, hoverIndex);
      /*
        Update the index for dragged item directly to avoid flickering
        when the image was half dragged into the next
      */
      // item.index = hoverIndex;

    }
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type, id: image.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="file-item"
    >
      <img alt={`img - ${image.id}`} src={image.src} className="file-img" />
    </div>
  );
}

const ImageList = ({ images, moveImage }) => {
  const renderImage = (image, index) => {
    // console.log('debug cxi', 'image.id , index:', image.id, index);
    return (
      <Image
        image={image}
        key={`${image.id}-image`}
        index={index}
        moveImage={moveImage}
      />
    );
  }
return <section className="file-list">{images.map(renderImage)}</section>
}

export default ImageList;