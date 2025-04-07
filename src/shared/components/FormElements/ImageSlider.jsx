import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ImageSlider = () => {
  const images = [
    {
      url: "https://t3.ftcdn.net/jpg/02/49/05/82/360_F_249058233_0MIaTy9WXtKHF0eacUSg9c3hkV9ehIbX.jpg",
      alt: "Image 1",
    },
    {
      url: "https://www.proofhub.com/articles/wp-content/uploads/2021/08/Employee-Management-System-Apps.png",
      alt: "Image 2",
    },
    {
      url: "https://empmonitor.com/blog/wp-content/uploads/2020/04/Importance-Of-Employee-Management-System.png",
      alt: "Image 3",
    },
  ];

  return (
    <Carousel
      showArrows={true}
      showThumbs={false}
      infiniteLoop={true}
      autoPlay={true}
      interval={1500}
      showStatus={false}
    >
      {images.map((image, index) => (
        <div key={index}>
          <img src={image.url} alt={image.alt} />
        </div>
      ))}
    </Carousel>
  );
};

export default ImageSlider;
