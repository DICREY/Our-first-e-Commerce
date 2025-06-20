// Librarys 
import React from "react";
import { Link, useLocation } from "react-router";

// Component 
const NavItems = ({ item }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Link
      to={item.url}
      className={`block px-3 py-2 transition ${
        item.url === pathname
          ? "text-white bg-primary rounded-xl hover:text-white hover:bg-primary dark:hover:text-white shadow-btnshdw active"
          : "text-link bg-transparent group/link"
      }`}
    >
      <span className="flex gap-3 align-center items-center">
        <span
          className={`${
            item.url === pathname
              ? "dark:bg-white rounded-full mx-1.5 group-hover/link:bg-primary !bg-primary h-[6px] w-[6px]"
              : "h-[6px] w-[6px] bg-black/40 dark:bg-white rounded-full mx-1.5 group-hover/link:bg-primary"
          }`}
        ></span>
        <span className="max-w-36 overflow-hidden">
          {item.name}
        </span>
      </span>
    </Link>
  );
};

export default NavItems;