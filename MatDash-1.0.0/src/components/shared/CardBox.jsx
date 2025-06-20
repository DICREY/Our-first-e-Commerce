import React from "react";

const CardBox = ({ children, className = "" }) => {
  return (
    <div
      className={`card p-[30px] shadow-md dark:shadow-none rounded-[12px] ${className}`}
    >
      {children}
    </div>
  );
};

export default CardBox;