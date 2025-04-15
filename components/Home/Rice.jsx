import MenuCategory from "@/components/MenuCategory";
import { Salad } from "lucide-react";
import React from "react";

const Rice = () => {
  return (
    <MenuCategory
      id={"rice"}
      title={"Rice"}
      description={"Classic staple served with various sides and flavors."}
    >
      <Salad className={"size-8 text-primary md:size-9"} />
    </MenuCategory>
  );
};

export default Rice;
