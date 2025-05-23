import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChefHat, LogOut, Package, ShieldCheck, UserRoundPen } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const UserPopover = ({ session }) => {
  return (
    <Popover>
      <div className={"flex items-center"}>
        <PopoverTrigger asChild>
          <Button variant={"ghost"} className={"rounded-full hover:bg-primary/20"}>
            <p className={"font-semibold text-foreground"}>Hi, {session.user.name.split(" ")[0]}</p>
          </Button>
        </PopoverTrigger>
        <PopoverContent className={"w-48 border border-primary/30 shadow-lg"}>
          <PopoverClose asChild>
            <Link href="/profile">
              <SubNavItem>
                <UserRoundPen />
                Profile
              </SubNavItem>
            </Link>
          </PopoverClose>

          {session.user.role === "chef" && (
            <PopoverClose asChild>
              <Link href="/manage">
                <SubNavItem>
                  <ChefHat />
                  Kitchen
                </SubNavItem>
              </Link>
            </PopoverClose>
          )}

          {session.user.role === "delivery" && (
            <PopoverClose asChild>
              <Link href="/manage">
                <SubNavItem>
                  <Package />
                  Deliveries
                </SubNavItem>
              </Link>
            </PopoverClose>
          )}

          {session.user.role === "admin" && (
            <PopoverClose asChild>
              <Link href="/manage">
                <SubNavItem>
                  <ShieldCheck />
                  Management
                </SubNavItem>
              </Link>
            </PopoverClose>
          )}

          <PopoverClose asChild>
            <SubNavItem onClick={async () => await authClient.signOut()}>
              <LogOut />
              Sign Out
            </SubNavItem>
          </PopoverClose>
        </PopoverContent>
      </div>
    </Popover>
  );
};

const SubNavItem = ({ children, ...props }) => {
  return (
    <Button
      variant={"ghost"}
      className={
        "w-full justify-start gap-4 text-foreground hover:bg-primary/40 [&_svg]:text-primary"
      }
      {...props}
    >
      {children}
    </Button>
  );
};

export default UserPopover;
