import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import { CreditCard, Plus, Minus, Trash2, Wallet } from "lucide-react";
import { cn, triggerToast } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/actions/createOrder";

// Define the CartIterator class
class CartIterator {
  constructor(items) {
    this.items = items;
    this.index = 0;
  }

  // Check if there are more items
  hasNext() {
    return this.index < this.items.length;
  }

  // Get the current item
  current() {
    return this.hasNext() ? this.items[this.index] : null;
  }

  // Move to the next item and return it
  next() {
    return this.hasNext() ? this.items[this.index++] : null;
  }

  // Reset the iterator to the beginning
  reset() {
    this.index = 0;
    return this;
  }

  // Create a new filtered iterator
  filter(predicate) {
    return new CartIterator(this.items.filter(predicate));
  }

  // Get all items as an array
  toArray() {
    return [...this.items];
  }

  // Get the total cost of all items
  getTotalCost() {
    let total = 0;
    this.reset();
    while (this.hasNext()) {
      const item = this.next();
      total += item.price * item.quantity;
    }
    return total;
  }

  // Get the total number of items (considering quantity)
  getTotalItems() {
    let count = 0;
    this.reset();
    while (this.hasNext()) {
      count += this.next().quantity;
    }
    return count;
  }
}

const Cart = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const [cartIterator, setCartIterator] = useState(null);
  const DELIVERY = 60;
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["createOrder"],
    mutationFn: async () => {
      return await createOrder({
        items: cartIterator.toArray(),
        deliveryLocation: address,
        deliveryCharge: DELIVERY,
        paymentMethod: paymentMethod
      });
    },
    onSuccess: () => {
      setOpen(false);
      clearCart();
      triggerToast("Order has been placed.");
    },
    onError: () => {
      triggerToast("Failed to place order", "error");
    }
  });

  const handleOrderPlacement = () => {
    if (!session) {
      router.push("/sign-in");
      return;
    }
    mutate();
  };

  useEffect(() => {
    setCartIterator(new CartIterator(items));
  }, [items]);

  // Render item using the iterator pattern
  const renderCartItems = () => {
    if (!cartIterator || cartIterator.toArray().length === 0) {
      return (
        <div className="mb-6 flex h-full flex-col items-center justify-center">
          <p className="text-foreground">Food cart is empty</p>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-auto">
        {cartIterator.toArray().map((item) => (
          <div
            key={item.id}
            className={
              "mt-3 flex w-full items-center space-x-4 rounded-xl border border-dashed border-primary/20 p-1"
            }
          >
            <div className={"size-[80px] min-h-[80px] min-w-[80px]"}>
              <Image
                src={item.image}
                alt={item.name}
                height={80}
                width={80}
                className={"size-full rounded-lg object-cover object-center"}
              />
            </div>

            <div className={"flex w-full flex-col justify-center"}>
              <div className="flex-1">
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm font-bold text-primary">{`৳ ${item.price}`}</p>
              </div>

              <div className={"flex justify-center"}>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className={"size-5 rounded-full bg-foreground/20 [&_svg]:size-3"}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="w-8 text-center">{item.quantity}</span>

                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className={"size-5 rounded-full bg-foreground/20 [&_svg]:size-3"}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className={"ml-auto"}
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Get cart summary data using iterator methods
  const getCartSummary = () => {
    if (!cartIterator || cartIterator.toArray().length === 0) {
      return { totalItems: 0, totalCost: 0 };
    }

    return {
      totalItems: cartIterator.getTotalItems(),
      totalCost: cartIterator.getTotalCost()
    };
  };

  const { totalItems, totalCost } = getCartSummary();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={"relative size-9 rounded-full hover:bg-primary/85 md:size-auto"}>
          <ShoppingBag />
          <p className={"hidden font-semibold md:block"}>Cart</p>
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs text-input">
              {totalItems}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className={"w-[95%] rounded-xl pb-0"}>
        <DialogHeader className={"sr-only"}>
          <DialogTitle className={"sr-only"}>Cart</DialogTitle>
          <DialogDescription className={"sr-only"}>Manage your food cart here</DialogDescription>
        </DialogHeader>

        <p className={"absolute left-4 top-3 font-bold"}>My Order</p>

        <div className="mt-2 flex h-full flex-col">
          {renderCartItems()}

          {cartIterator && cartIterator.toArray().length > 0 && (
            <>
              <div className={"my-4 h-px border-[1px] border-t border-dashed border-primary/20"} />

              <p className={"uppercase"}>Location</p>
              <Input
                placeholder={"Type a location..."}
                required
                className={"mt-3 border-primary"}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />

              <p className={"mt-3 uppercase"}>Payment</p>
              <Button
                variant={"outline"}
                className={cn(
                  "mt-3 gap-5",
                  paymentMethod === "cod" ? "border-primary" : "border-dashed border-primary/20"
                )}
                onClick={() => {
                  setPaymentMethod("cod");
                }}
              >
                <Wallet className={"text-primary"} />
                Cash on Delivery
              </Button>
              <Button
                variant={"outline"}
                className={cn(
                  "mt-3 gap-5",
                  paymentMethod === "cod" ? "border-dashed border-primary/20" : "border-primary"
                )}
                onClick={() => {
                  setPaymentMethod("digital");
                }}
              >
                <CreditCard className={"text-primary"} />
                Digital Payment
              </Button>

              <div className={"my-4 h-px border-[1px] border-t border-dashed border-primary/20"} />

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm font-normal">
                  <span>DELIVERY</span>
                  <span>{`৳ ${DELIVERY}`}</span>
                </div>

                <div className="flex justify-between font-bold">
                  <span>TOTAL</span>
                  <span>{`৳ ${totalCost + DELIVERY}`}</span>
                </div>
              </div>

              <Button
                className="my-6 w-full rounded-full py-5"
                disabled={isSessionPending || isPending}
                onClick={handleOrderPlacement}
              >
                Confirm Order
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Cart;
