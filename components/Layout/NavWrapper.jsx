"use client";
import { usePathname } from "next/navigation";

const NO_NAV_SCREENS = ["/sign-in"];

const NavWrapper = ({ children }) => {
  const pathname = usePathname();
  if (NO_NAV_SCREENS.includes(pathname)) {
    return null;
  }

  return children;
};

export default NavWrapper;
