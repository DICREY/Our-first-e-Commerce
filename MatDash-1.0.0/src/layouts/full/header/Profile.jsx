// Librarys 
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";

// Imports 
import user1 from "../../../assets/images/profile/user-1.jpg";

// Import styles 
import styles from "../../../css/headers/Profile.module.css";

// Component 
const Profile = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Cierra el menú si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.relative} ref={menuRef}>
      <span
        className={styles.menuBtn}
        onClick={() => setOpen((prev) => !prev)}
      >
        <img
          src={user1}
          alt="logo"
          height="35"
          width="35"
          className="rounded-full"
        />
        <span className={styles.avatar}></span>
      </span>
      {open && (
        <div className={styles.dropdown}>
          <Link
            to="#"
            className={styles.dropdownLink}
          >
            {/* <Icon icon="solar:user-circle-outline" height={20} /> */}
            My Profile
          </Link>
          <Link
            to="#"
            className={styles.dropdownLink}
          >
            {/* <Icon icon="solar:letter-linear" height={20} /> */}
            My Account
          </Link>
          <Link
            to="#"
            className={styles.dropdownLink}
          >
            {/* <Icon icon="solar:checklist-linear" height={20} /> */}
            My Task
          </Link>
          <div className={styles.logoutWrapper}>
            <Link
              to="/auth/login"
              className={styles.logoutBtn}
            >
              Logout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;