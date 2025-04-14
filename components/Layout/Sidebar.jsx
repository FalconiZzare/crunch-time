import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/constants/Navitems";
import Link from "next/link";

const Sidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className={"size-9 rounded-full hover:bg-primary/5 xl:hidden"} variant={"ghost"}>
          <AlignRight />
        </Button>
      </SheetTrigger>
      <SheetContent className={"flex flex-col items-center overflow-x-hidden border-primary/30"}>
        <SheetHeader>
          <SheetTitle className={"sr-only"}>Sidebar</SheetTitle>
          <SheetDescription className={"sr-only"}>Sidebar Navigation Menu</SheetDescription>
        </SheetHeader>

        <p className={"absolute left-4 top-4 text-xl font-semibold"}>Menu Categories</p>

        <div className={"mt-10 w-full"}>
          {NAV_ITEMS.map((item, index) => (
            <SheetClose key={index} asChild>
              <Link
                href={item.url}
                className={"flex flex-1 items-center border-b border-primary/30 py-4"}
              >
                {item.icon}
                <p className={"ml-4 text-lg font-semibold tracking-wide"}>{item.name}</p>
              </Link>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
