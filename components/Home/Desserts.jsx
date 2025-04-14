import React from "react";
import { IceCreamBowl } from "lucide-react";
import MenuCategory from "@/components/MenuCategory";

const Desserts = () => {
  return (
    <MenuCategory
      id={"desserts"}
      dishes={Array(10).fill(null)}
      title={"Desserts"}
      description={"Sweet treats to satisfy your cravings."}
    >
      <IceCreamBowl className={"size-8 text-primary md:size-9"} />
    </MenuCategory>
  );
};

export default Desserts;
