import React from "react";
import { StaticImage } from "gatsby-plugin-image";

import { useSiteMetadata } from "../../hooks/Metadata";
import { box, image, text } from "./Hero.module.css";

const Hero = () => {
  const { siteGreeting, userName } = useSiteMetadata();

  return (
    <div className={box}>
      <div className={image}>
        <StaticImage
          src="hero.jpg"
          alt={userName}
          loading="eager"
          placeholder="none"
          height={96}
          width={96}
        />
      </div>
      <div className={text}>{siteGreeting}</div>
    </div>
  );
};

export default Hero;
