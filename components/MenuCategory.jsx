"use client";

import React from "react";
import Container from "@/components/Container";
import { Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getDishes } from "@/actions/getDishes";
import { Skeleton } from "@/components/ui/skeleton";
import MenuItem from "@/components/MenuItem";

const MenuCategory = ({ id, title, description, children }) => {
  const { data, isPending } = useQuery({
    queryKey: [`getDishes${id.toLowerCase()}`],
    queryFn: async () => {
      return await getDishes(id.toLowerCase());
    }
  });

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
        {isPending ? (
          Array(10)
            .fill(null)
            .map((_, i) => <Skeleton key={i} className={"h-28 w-full rounded-xl"} />)
        ) : data && data.length > 0 ? (
          data.map((item, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div
                  className={
                    "flex h-full w-full cursor-pointer rounded-xl border border-dashed border-foreground/20"
                  }
                >
                  <div className={"flex w-full items-center gap-3 overflow-hidden px-2 py-1"}>
                    <div className={"size-[100px] min-h-[100px] min-w-[100px]"}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        height={100}
                        width={100}
                        className={"size-full rounded-lg object-cover object-center"}
                      />
                    </div>
                    <div className={"flex h-full w-full flex-col py-2 text-left"}>
                      <p className={"font-semibold capitalize"}>{item.name}</p>
                      <p
                        className={cn(
                          "text-xs font-normal tracking-tight",
                          item.inStock ? "text-green-500" : "text-red-500"
                        )}
                      >
                        {item.inStock ? "Available" : "Unavailable"}
                      </p>
                      <div className={"mt-auto flex items-center justify-between pr-2"}>
                        <p className={"font-medium text-primary"}>{`Tk ${item.price}`}</p>
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
              </DialogTrigger>

              <MenuItem item={item} />
            </Dialog>
          ))
        ) : (
          <p className={"col-span-4 py-24 text-primary/70"}>
            Sorry, nothing available at this moment
          </p>
        )}
      </div>
    </Container>
  );
};

export default MenuCategory;
