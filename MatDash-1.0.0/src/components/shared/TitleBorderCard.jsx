import React from "react"

const TitleCard = ({
  children,
  className = "",
  title = "",
}) => {
  return (
    <div
      className={`card dark:shadow-dark-md shadow-md p-0 rounded-[12px] ${className}`}
    >
      <div className="flex justify-between items-center border-b border-ld px-6 py-4">
        <h5 className="text-xl font-semibold">{title}</h5>
      </div>
      <div className="pt-4 p-6">{children}</div>
    </div>
  )
}

export default TitleCard