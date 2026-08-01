import React from "react";
import NavLink from "./NavLink.jsx";
import navLinksData from "./NavLinks.json";
import styles from "./Header.module.css";

function Header({ title = "SSDC" }) {
  return (
    <div className={styles.headerContainer}>
      <header className={styles.headerContent}>
        {/* Animated Logo */}
        <a href="https://shrinakul.github.io/WEB-SSDC/" className={styles.logoLink}>
          <span className={styles.logoTitle}>{title}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.logoIcon}
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7z" />
          </svg>
        </a>

        {/* Animated Navigation */}
        <nav>
          <ul className={styles.navList}>
            {navLinksData.map((link) => (
              <NavLink key={link.name} to={link.to}>
                {link.name}
              </NavLink>
            ))}
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Header;
