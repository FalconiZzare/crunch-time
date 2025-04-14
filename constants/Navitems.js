import { IceCreamBowl, Pizza, Salad, Sandwich, Soup, Wine } from "lucide-react";

export const NAV_ITEMS = [
  {
    name: "Rice",
    url: "/#rice",
    icon: <Salad className={"text-primary"} />
  },
  {
    name: "Curry",
    url: "/#curry",
    icon: <Soup className={"text-primary"} />
  },
  {
    name: "Snacks",
    url: "/#snacks",
    icon: <Pizza className={"text-primary"} />
  },
  {
    name: "Desserts",
    url: "/#desserts",
    icon: <IceCreamBowl className={"text-primary"} />
  },
  {
    name: "Drinks",
    url: "/#drinks",
    icon: <Wine className={"text-primary"} />
  },
  {
    name: "Street Food",
    url: "/#street-food",
    icon: <Sandwich className={"text-primary"} />
  }
];
