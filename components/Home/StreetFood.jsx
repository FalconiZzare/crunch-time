import React from "react";
import { Sandwich } from "lucide-react";
import MenuCategory from "@/components/MenuCategory";

const StreetFood = () => {
  return (
    <MenuCategory
      id={"street-food"}
      title={"Street Food"}
      description={"Bold, tasty eats straight from the streets."}
    >
      <Sandwich className={"size-8 text-primary md:size-9"} />
    </MenuCategory>
  );
};

export default StreetFood;
