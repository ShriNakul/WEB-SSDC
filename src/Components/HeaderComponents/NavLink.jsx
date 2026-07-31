import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

function NavLink({ to, children }) {
  return (
    <li>
      <Link to={to} className={styles.navLink}>
        {children}
      </Link>
    </li>
  );
}

export default NavLink;
