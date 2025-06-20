import React from "react";
import { Icon } from "@iconify/react";

const TitleIconCard = ({
  children,
  className = "",
  title = "",
  icon,
  onDownload,
}) => {
  return (
    <div
      className={`card dark:shadow-dark-md shadow-md p-0 rounded-[12px] ${className}`}
    >
      <div className="flex justify-between items-center border-b border-ld px-6 py-4">
        <h5 className="text-xl font-semibold">{title}</h5>
        <button
          className="flex items-center bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-dark transition"
          style={{ fontSize: "0.875rem" }}
          onClick={onDownload}
          type="button"
        >
          <Icon
            icon={icon || "solar:download-minimalistic-bold-duotone"}
            width={20}
            height={20}
          />
        </button>
      </div>
      <div className="pt-4 p-6">{children}</div>
    </div>
  );
};

export default TitleIconCard;