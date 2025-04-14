import React from "react";
import { Pizza } from "lucide-react";
import MenuCategory from "@/components/MenuCategory";

const Snacks = () => {
  return (
    <MenuCategory
      id={"snacks"}
      dishes={Array(10).fill(null)}
      title={"Snacks"}
      description={"Quick bites to munch anytime, anywhere."}
    >
      <Pizza className={"size-8 text-primary md:size-9"} />
    </MenuCategory>
  );
};

export default Snacks;
