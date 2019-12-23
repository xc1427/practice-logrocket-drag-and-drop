## practice

https://blog.logrocket.com/drag-and-drop-in-react/



## 为什么这句话 item.index = hoverIndex 可以避免闪烁;

我们不加这句话 ，拿两个 image 做实验。我们在两个地方插入 console.log, 看输出的结果

![final_app_look.jpg](./doc/final_app_look.jpg)



### ImageList 渲染的时候

```jsx
const renderImage = (image, index) => {
  console.log('debug cxi', 'image.id , index:', image.id, index);
  return (
    <Image
      image={image}
      key={`${image.id}-image`}
      index={index}
      moveImage={moveImage}
    />
  );
}
```

```
debug cxi image.id , index: dog.jpg 0
debug cxi image.id , index: dog2.jpeg 1

debug cxi image.id , index: dog2.jpeg 0
debug cxi image.id , index: dog.jpg 1

debug cxi image.id , index: dog.jpg 0
debug cxi image.id , index: dog2.jpeg 1
```

当移动后，触发了 react 的 re-render，因为移动了所以各个 image 的顺序是切实发生了变化，这个变化是 id 的顺序的变化。

当 re-render 时，配合 id 的 index 也确实发生了变化。因为没有影响到 key，所以对于 react ，不会销毁元素，只是因为 key 交换了顺序，而交换两个 dom 的顺序。



### hover(item) { } 触发的时候
```jsx
hover(item) {  // item is the dragged element

  if (!ref.current) {
    return;
  }
  const dragIndex = item.index;
  const hoverIndex = index;
  if (dragIndex === hoverIndex) {
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
```
```
debug cxi dragIndex-id vs hoverIndex-id: 0-dog.jpg 1-dog2.jpeg

debug cxi dragIndex-id vs hoverIndex-id: 0-dog.jpg 1-dog.jpg

debug cxi dragIndex-id vs hoverIndex-id: 0-dog.jpg 1-dog2.jpeg

debug cxi dragIndex-id vs hoverIndex-id: 0-dog.jpg 1-dog.jpg

```

hover 回调的时候，drag 的 id 是不变，是容易理解的，因为虽然做了 move 的操作，被 drag 的那个 React 组件没有被销毁，（提醒一个事实：`hover(item) { }` 被调用的对象是被 hover 的那个组件）无论它 hover 到谁头上，都一直是这个 React 组件被 drag，应该是由于 hook 中闭包的原理，被 drag 的组件的 index 并未改变。

hover 组件的 id 是交替输出的，hover 的 index 一直都是 1。这个也是可以理解的，因为被交换顺序后，被 hover 的元素确实是改变了的，引发被 hover 的元素相应的 `hover(item) { }` 方法被执行。但由于 drag 的元素是一直会悬浮在 index 1 上面，所以 hover 的 index 是不变的。


### 总结分析
总结下来，`hover(item) { }` 是跟着被 hover 的元素走的，被 hover 元素的 key 可以保持住（也应该保持住），但是这个 key 对应的 index 可以发生变化，表示本次渲染时，当前的元素被渲染在了哪个地方。

而因为 dragIndex 和 hoverIndex 恒不等于，所以就一直会调用 moveImage，而 moveImage 的本质是互换 dragIndex 和 hoverIndex 两个位置上的 image (state) 的数据，这个会致使 image 的移动。


`item.index = hoverIndex` 是一种手工的解法，因为我们知道当执行过 moveImage 后，drag 的元素其实应该是当前所 hover 的元素。