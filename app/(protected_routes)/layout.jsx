"use client";

import React, { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Logo from "@/components/Logo/Logo";
import { usePathname, useRouter } from "next/navigation";

const Layout = ({ children }) => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && (!session || !session.user)) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, session, pathname, router]);

  if (isPending || !session || !session.user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="relative rounded-full p-1">
          <Logo className="w-12" />
          <div className="absolute right-0 top-0 h-full w-full animate-ping rounded-full border-[4px] border-foreground" />
        </div>
      </div>
    );
  }

  return children;
};

export default Layout;
