import React from "react";
import Logo from "@/components/Logo/Logo";
import Text from "@/components/Logo/Text";
import { ChefHat, LogOut, Package, ShieldCheck, ShoppingBag, UserRoundPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/constants/Navitems";
import Link from "next/link";
import Sidebar from "@/components/Layout/Sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { auth } from "@/auth";
import { headers } from "next/headers";

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <nav className={"fixed left-0 right-0 top-0 z-50 select-none px-1 pt-1 md:pt-1.5"}>
      <div
        className={
          "flex w-full items-center justify-between rounded-full border border-primary/5 bg-accent px-2 py-1.5 shadow-lg md:py-2"
        }
      >
        <Link href={"/"} className={"flex items-center gap-2.5 pl-1 md:pl-5"}>
          <Logo className={"w-7"} />
          <Text className={"hidden h-3.5 md:block"} />
        </Link>
        <div className={"hidden gap-5 xl:flex"}>
          {NAV_ITEMS.map((item, index) => (
            <Link href={item.url} key={index}>
              <Button
                variant={"ghost"}
                className={
                  "items-center rounded-full font-semibold tracking-wide hover:bg-primary/5 [&_svg]:size-5"
                }
              >
                {item.icon}
                <p className={"text-foreground"}>{item.name}</p>
              </Button>
            </Link>
          ))}
        </div>
        <div className={"flex items-center gap-2"}>
          {!session ? (
            <Link href={"/sign-in"}>
              <Button className={"rounded-full hover:bg-primary/85"}>
                <p className={"font-semibold"}>Sign In</p>
              </Button>
            </Link>
          ) : (
            <Popover>
              <div className={"flex items-center"}>
                <PopoverTrigger asChild>
                  <Button variant={"ghost"} className={"rounded-full hover:bg-primary/20"}>
                    <p className={"font-semibold text-foreground"}>
                      Hi, {session.user.name.split(" ")[0]}
                    </p>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={"w-48 border border-primary/30 shadow-lg"}>
                  <Link href="/profile">
                    <SubNavItem>
                      <UserRoundPen />
                      Profile
                    </SubNavItem>
                  </Link>

                  {session.user.role === "chef" && (
                    <Link href="/manage">
                      <SubNavItem>
                        <ChefHat />
                        Kitchen
                      </SubNavItem>
                    </Link>
                  )}

                  {session.user.role === "delivery" && (
                    <Link href="/manage">
                      <SubNavItem>
                        <Package />
                        Deliveries
                      </SubNavItem>
                    </Link>
                  )}

                  {session.user.role === "admin" && (
                    <Link href="/manage">
                      <SubNavItem>
                        <ShieldCheck />
                        Management
                      </SubNavItem>
                    </Link>
                  )}

                  <form
                    action={async () => {
                      "use server";
                      await auth.api.signOut({
                        headers: await headers()
                      });
                    }}
                  >
                    <SubNavItem>
                      <LogOut />
                      Sign Out
                    </SubNavItem>
                  </form>
                </PopoverContent>
              </div>
            </Popover>
          )}
          <Button className={"size-9 rounded-full hover:bg-primary/85 md:size-auto"}>
            <ShoppingBag />
            <p className={"hidden font-semibold md:block"}>Cart</p>
          </Button>
          <Sidebar />
        </div>
      </div>
    </nav>
  );
};

const SubNavItem = ({ children }) => {
  return (
    <Button
      variant={"ghost"}
      className={
        "w-full justify-start gap-4 text-foreground hover:bg-primary/40 [&_svg]:text-primary"
      }
    >
      {children}
    </Button>
  );
};

export default Navbar;
