"use client";

import React from "react";
import Container from "@/components/Container";
import { Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

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
          <Dialog key={i}>
            <DialogTrigger asChild>
              <div
                className={
                  "flex h-full w-full cursor-pointer rounded-xl border border-dashed border-foreground/20"
                }
              >
                <div className={"flex w-full items-center gap-3 overflow-hidden px-2 py-1"}>
                  <Image
                    src={"/images/burger.png"}
                    alt={"burger"}
                    height={100}
                    width={100}
                    className={"size-[100px] rounded-lg object-cover object-center"}
                  />
                  <div className={"flex h-full w-full flex-col py-2 text-left"}>
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
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Plus className={"text-input"} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent
              className={
                "flex w-11/12 max-w-lg flex-col items-center justify-center rounded-lg md:w-full md:flex-row"
              }
            >
              <DialogHeader className={"sr-only"}>
                <DialogTitle className={"sr-only"}>Delight Burger</DialogTitle>
                <DialogDescription className={"sr-only"}>Description</DialogDescription>
              </DialogHeader>
              <div className="min-h-[200px] min-w-[200px]">
                <Image
                  src="/images/burger.png"
                  height={200}
                  width={200}
                  alt={"burger"}
                  className={"size-full rounded-lg object-cover object-center"}
                />
              </div>
              <div className="flex h-full flex-col justify-evenly">
                <h2 className="text-2xl font-bold">Delight Burger</h2>
                <div className="mt-[0.25rem]">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora quisquam iusto
                  maxime, ratione nulla numquam ipsa. Quo
                </div>
                <p className={"mt-3 font-bold uppercase text-foreground/70"}>Price</p>
                <p className="mt-1 w-max text-sm font-semibold">Tk 380</p>
                <div className={"mt-4 flex items-center justify-center gap-3"}>
                  <div className={"flex items-center gap-2"}>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className={"size-5 rounded-full bg-foreground/20 [&_svg]:size-3"}
                    >
                      <Plus />
                    </Button>
                    <p className={"text-lg font-medium"}>1</p>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className={"size-5 rounded-full bg-foreground/20 [&_svg]:size-3"}
                    >
                      <Plus />
                    </Button>
                  </div>
                  <Button className={"rounded-full bg-foreground px-5 text-xs font-normal"}>
                    <p>৳ 33380</p>
                    <Separator orientation={"vertical"} className={"bg-background/30"} />
                    <p>Add to order</p>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </Container>
  );
};

export default MenuCategory;
