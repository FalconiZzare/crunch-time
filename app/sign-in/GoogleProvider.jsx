"use client";

import React, { Suspense } from "react";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const GoogleSignInButton = () => {
  const { useSearchParams } = require("next/navigation");
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

const ButtonFallback = () => {
  return (
    <Button
      variant={"outline"}
      className={
        "mt-4 w-full items-center justify-center gap-5 py-5 text-base md:w-10/12 [&_svg]:size-5"
      }
      disabled
    >
      <Icons.google />
      Loading...
    </Button>
  );
};

const GoogleProvider = () => {
  return (
    <Suspense fallback={<ButtonFallback />}>
      <GoogleSignInButton />
    </Suspense>
  );
};

export default GoogleProvider;
