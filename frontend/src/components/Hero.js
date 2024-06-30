import React from "react";
import { Carousel, Container } from "react-bootstrap";

const carouselItems = [
  {
    src: "/assets/images/carousel/image1.png",
    alt: "First slide",
    title: "Recipe 1",
    caption: "Discover the magic of our top alchemy recipe.",
  },
  {
    src: "/assets/images/carousel/image2.png",
    alt: "Second slide",
    title: "Recipe 2",
    caption: "Experience the enchantment of our second best recipe.",
  },
  {
    src: "/assets/images/carousel/image3.png",
    alt: "Third slide",
    title: "Recipe 3",
    caption: "Step into the mystical world with our third favorite recipe.",
  },
  // ... add more items as needed
];

const Hero = () => {
  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Welcome to Alchemic Recipes</h1>
      <Carousel>
        {carouselItems.map((item, index) => (
          <Carousel.Item key={index}>
            <img className="d-block w-100" src={item.src} alt={item.alt} />
            <Carousel.Caption>
              <h3>{item.title}</h3>
              <p>{item.caption}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default Hero;