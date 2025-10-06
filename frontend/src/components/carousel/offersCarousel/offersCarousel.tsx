"use client";
import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

export default function OffersCarousel() {
  const [currentImage, setCurrentImage] = useState(0);
  const [screenSize, setScreenSize] = useState("sm");

  const imagesSm = [
    "/offers/ofertas-img-4.jpg",
    "/offers/ofertas-img-5.jpg",
    "/offers/ofertas-img-3.jpg",
    "/offers/ofertas-img-6.jpg",
    "/offers/ofertas-img-7.png",
  ];

  const imagesmd = [
    "/offers/ofertas-img-3.jpg",
    "/offers/ofertas-img-4.jpg",
    "/offers/ofertas-img-5.jpg",
    "/offers/ofertas-img-6.jpg",
    "/offers/ofertas-img-7.png",
  ];

  const imagesLg = [
    "/offers/ofertas-img-1.jpg",
    "/offers/ofertas-img-2.jpg",
    "/offers/ofertas-img-5.jpg",
    "/offers/ofertas-img-6.jpg",
    "/offers/ofertas-img-7.png",
  ];

  const containerRef = useRef(null);

  useEffect(() => {
    // Detectar el tamaño de la pantalla al cargar y cuando cambie el tamaño de la ventana
    const handleResize = () => {
      if (window.innerWidth >= 1024) setScreenSize("lg");
      else if (window.innerWidth >= 768) setScreenSize("md");
      else setScreenSize("sm");
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const interval = setInterval(() => {
      setCurrentImage((prevImage) => {
        return (prevImage + 1) % getImagesForSize().length;
      });
    }, 5000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, );

  // Función para obtener las imágenes según el tamaño de la pantalla
  const getImagesForSize = () => {
    if (screenSize === "lg") return imagesLg;
    if (screenSize === "md") return imagesmd;
    return imagesSm;
  };

  const goToNext = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % getImagesForSize().length);
  };

  const goToPrev = () => {
    setCurrentImage((prevImage) =>
      prevImage === 0 ? getImagesForSize().length - 1 : prevImage - 1
    );
  };

  const imagesToShow = getImagesForSize();

  return (
    <section className="w-full h-[250px] overflow-hidden relative md:h-[300px] lg:h-[400px] mb-10">
      <div
        ref={containerRef}
        className="flex transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${currentImage * 100}%)`,
        }}
      >
        {imagesToShow.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0 h-full relative">
            <Image
              src={image}
              alt={`Oferta ${index + 1}`}
              width={1000}
              height={400}
              style={{ objectFit: "cover" }}
              className={`${
                screenSize === "sm" ? "flex md:hidden lg:hidden" :
                screenSize === "md" ? "hidden md:flex lg:hidden" : 
                "hidden md:hidden lg:flex"
              } w-full h-full`}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <FaArrowCircleLeft
        onClick={goToPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-400 text-[35px] rounded-full cursor-pointer"
      />

      <FaArrowCircleRight
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-400 text-[35px] rounded-full cursor-pointer"
      />
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {imagesToShow.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              currentImage === index ? 'bg-blue-500' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
