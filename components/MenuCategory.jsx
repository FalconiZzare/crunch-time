import React from "react";
import Container from "@/components/Container";
import { Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MenuCategory = ({ id, dishes, title, description, children }) => {
  return (
    <Container id={id}>
      <div className={"flex items-center gap-3"}>
        {children}
        <p className={"text-xl font-bold md:text-2xl"}>{title}</p>
      </div>
      <p className={"mt-2 font-medium capitalize tracking-wide"}>{description}</p>
      <div
        className={
          "mt-5 grid grid-cols-1 place-items-center gap-x-2 gap-y-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }
      >
        {dishes.map((_, i) => (
          <div
            key={i}
            className={"flex h-full w-full rounded-xl border border-dashed border-foreground/20"}
          >
            <div className={"flex w-full items-center gap-3 overflow-hidden px-2 py-1"}>
              <Image
                src={"/images/burger.png"}
                alt={"burger"}
                height={100}
                width={100}
                className={"size-[100px] rounded-lg object-cover object-center"}
              />
              <div className={"flex h-full w-full flex-col py-2"}>
                <p className={"font-semibold"}>Big Mac</p>
                <p
                  className={cn(
                    "text-xs font-normal tracking-tight",
                    i % 2 === 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {i % 2 === 0 ? "Available" : "Unavailable"}
                </p>
                <div className={"mt-auto flex items-center justify-between pr-2"}>
                  <p className={"font-medium text-primary"}>Tk 560</p>
                  <Button
                    size={"icon"}
                    className={"size-7 rounded-full bg-foreground hover:bg-foreground/90"}
                  >
                    <Plus className={"text-input"} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default MenuCategory;
