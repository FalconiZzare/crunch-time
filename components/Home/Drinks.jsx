import React from "react";
import { Wine } from "lucide-react";
import MenuCategory from "@/components/MenuCategory";

const Drinks = () => {
  return (
    <MenuCategory
      id={"drinks"}
      title={"Drinks"}
      description={"Refreshing beverages to cool or energize."}
    >
      <Wine className={"size-8 text-primary md:size-9"} />
    </MenuCategory>
  );
};

export default Drinks;
