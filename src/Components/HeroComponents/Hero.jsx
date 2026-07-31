import React from "react";
import HeroButton from "./HeroButton.jsx";
import styles from "./Hero.module.css";

function Hero({
  title,
  description,
  imageSrc,
  imageAlt = "Hero Image",
  buttons = [],
  reverseLayout = true,
}) {
  return (
    <section className={styles.heroSection}>
      <div
        className={`${styles.heroContainer} ${
          reverseLayout ? styles.reverse : ""
        }`}
      >
        {/* Image Section */}
        <div className={styles.imageWrapper}>
          <img
            src={imageSrc}
            alt={imageAlt}
            className={styles.heroImage}
            loading="lazy"
            width="700"
            height="500"
          />
        </div>

        {/* Text Section */}
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>

          <div className={styles.buttonGroup}>
            {buttons.map((btn) => (
              <HeroButton
                key={btn.label}
                label={btn.label}
                href={btn.href}
                variant={btn.variant}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
