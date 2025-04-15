import React from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/useCartStore";

const MenuItem = ({ item }) => {
  const [quantity, setQuantity] = React.useState(1);
  const addToCart = useCartStore((state) => state.addToCart);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(item, quantity);
    setQuantity(1);
  };

  return (
    <DialogContent
      className={
        "flex w-11/12 max-w-lg flex-col items-center justify-center rounded-lg md:w-full md:flex-row"
      }
    >
      <DialogHeader className={"sr-only"}>
        <DialogTitle className={"sr-only"}>{item.name}</DialogTitle>
        <DialogDescription className={"sr-only"}>{item.description}</DialogDescription>
      </DialogHeader>
      <div className="size-[200px] min-h-[200px] min-w-[200px]">
        <Image
          src={item.image}
          height={200}
          width={200}
          alt={"burger"}
          className={"size-full rounded-lg object-cover object-center"}
        />
      </div>
      <div className="flex h-full flex-col justify-evenly">
        <h2 className="text-2xl font-bold capitalize">{item.name}</h2>
        <div className="mt-[0.25rem]">{item.description}</div>
        <div className={"mt-4 flex items-center justify-between gap-3"}>
          <div>
            <p className={"font-bold uppercase text-foreground/70"}>Price</p>
            <p className="mt-1 w-max text-sm font-semibold">{`Tk ${item.price}`}</p>
          </div>
          <div className={"flex items-center gap-2"}>
            <Button
              variant={"ghost"}
              size={"icon"}
              className={"size-5 rounded-full bg-foreground/20 [&_svg]:size-3"}
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <Minus />
            </Button>
            <p className={"select-none text-lg font-medium"}>{quantity}</p>
            <Button
              variant={"ghost"}
              size={"icon"}
              className={"size-5 rounded-full bg-foreground/20 [&_svg]:size-3"}
              onClick={increaseQuantity}
            >
              <Plus />
            </Button>
          </div>
        </div>
        <DialogClose asChild>
          <Button
            className={
              "mt-5 w-full gap-10 rounded-full bg-foreground px-5 text-xs font-normal md:gap-6"
            }
            onClick={handleAddToCart}
          >
            <p className={"min-w-[50px] select-none"}>{`৳ ${item.price * quantity}`}</p>
            <Separator orientation={"vertical"} className={"bg-background/30"} />
            <p>Add To Order</p>
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
};

export default MenuItem;
