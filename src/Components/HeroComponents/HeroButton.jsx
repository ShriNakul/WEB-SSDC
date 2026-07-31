import React from "react";
import styles from "./Hero.module.css";

function HeroButton({ label, href, variant = "primary" }) {
  const buttonClass =
    variant === "primary" ? styles.btnPrimary : styles.btnSecondary;

  return (
    <a href={href} className={`${styles.btn} ${buttonClass}`}>
      {label}
    </a>
  );
}

export default HeroButton;
