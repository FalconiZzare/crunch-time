"use client";

import React from "react";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const GoogleProvider = () => {
  return (
    <Suspense>
      <ProviderBody />
    </Suspense>
  );
};

const ProviderBody = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: callbackUrl
    });
  };

  return (
    <Button
      variant={"outline"}
      className={
        "mt-4 w-full items-center justify-center gap-5 py-5 text-base md:w-10/12 [&_svg]:size-5"
      }
      onClick={signIn}
    >
      <Icons.google />
      Continue with Google
    </Button>
  );
};

export default GoogleProvider;
