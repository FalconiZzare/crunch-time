import MenuCategory from "@/components/MenuCategory";
import { Soup } from "lucide-react";
import React from "react";

const Rice = () => {
  return (
    <MenuCategory
      id={"curry"}
      title={"Curry"}
      description={"Rich, spicy, and flavorful dishes with gravy."}
    >
      <Soup className={"size-8 text-primary md:size-9"} />
    </MenuCategory>
  );
};

export default Rice;
