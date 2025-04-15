import React from "react";

const SectionHeader = ({ title, children }) => {
  return (
    <div className={"flex items-center gap-3"}>
      {children}
      <p className={"text-lg font-bold md:text-xl"}>{title}</p>
    </div>
  );
};

export default SectionHeader;
