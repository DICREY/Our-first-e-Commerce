// Librarys 
import { useState, useEffect } from "react";
import { Link } from "react-router";
// import { Icon } from "@iconify/react";

// Imports
import MobileSidebar from "../sidebar/MobileSidebar";
import Profile from "./Profile";
import Notification from "./notification";

// Import styles 
import styles from "../../../css/headers/Header.module.css";

// Component 
const Header = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // mobile-sidebar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <header
        className={
          styles.stickyHeader +
          " " +
          (isSticky ? styles.stickyActive : styles.stickyInactive)
        }
      >
        <nav className={styles.navbar}>
          <div className={styles.navFlex}>
            <div className={styles.leftFlex}>
              <span
                onClick={() => setIsOpen(true)}
                className={styles.menuBtn}
              >
                {/* Icono de menú */}
              </span>
              <Notification />
            </div>
            <div className={styles.rightFlex}>
              <Link
                to="#"
                className={styles.downloadBtn}
              >
                Download Free
              </Link>
              <Profile />
            </div>
          </div>
        </nav>
      </header>
      
      {/* Sidebar móvil */}
      {isOpen && (
        <div className={styles.mobileSidebarOverlay}>
          <div
            className={styles.mobileSidebarBg}
            onClick={handleClose}
          ></div>
          <div className={styles.mobileSidebarPanel}>
            <button
              onClick={handleClose}
              className={styles.closeBtn}
            >
              &times;
            </button>
            <MobileSidebar />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;