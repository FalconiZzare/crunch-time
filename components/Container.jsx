import React from "react";
import { cn } from "@/lib/utils";

const Container = ({ className, vClassName, children, ...props }) => {
  return (
    <div className={cn("w-full px-3 py-2", className)} {...props}>
      <div className={cn("rounded-lg bg-input px-3 py-2", vClassName)}>{children}</div>
    </div>
  );
};

export default Container;
