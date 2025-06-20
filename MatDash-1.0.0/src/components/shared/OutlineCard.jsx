import React from "react";

const OutlineCard = ({ children, className = "" }) => {
  return (
    <div className={`card border border-ld rounded-[12px] p-6 bg-white dark:bg-darkgray ${className}`}>
      {children}
    </div>
  );
};

export default OutlineCard;