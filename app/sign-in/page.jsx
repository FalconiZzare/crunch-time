import React from "react";
import { cn } from "@/lib/utils";
import TrueFocus from "@/components/ui/true-focus";
import { Button } from "@/components/ui/button";
import { House } from "lucide-react";
import Link from "next/link";
import { Icons } from "@/components/Icons";

const Page = () => {
  return (
    <div className={"relative flex items-center justify-center"}>
      <div
        className={cn(
          "relative w-full max-w-xs overflow-hidden rounded-2xl shadow-xl md:max-w-md",
          "z-20 bg-[url('/images/login_bg.avif')] bg-cover bg-center bg-no-repeat"
        )}
      >
        <div
          className={
            "relative flex flex-col items-center justify-center px-5 py-20 md:px-12 md:py-28"
          }
        >
          <TrueFocus
            sentence="CRUNCH TIME"
            manualMode={false}
            blurAmount={0.5}
            borderColor="hsl(var(--primary))"
            glowColor="hsl(var(--primary))"
            animationDuration={0.5}
            pauseBetweenAnimations={1.5}
            className={"justify-center text-background"}
          />

          <h1
            className={
              "mt-4 text-center text-sm font-normal capitalize tracking-wide text-input drop-shadow-md md:max-w-sm"
            }
          >
            High quality ingredients mixed with excellent service is the best recipe for a
            successful food vendor.
          </h1>

          <p className={"mb-6 mt-20 text-xl font-bold tracking-wide text-input"}>Welcome Back!</p>

          <Button
            variant={"outline"}
            className={
              "mt-4 w-full items-center justify-center gap-5 py-5 text-base md:w-10/12 [&_svg]:size-5"
            }
          >
            <Icons.google />
            Continue with Google
          </Button>

          <Button
            variant={"outline"}
            className={
              "mt-4 w-full items-center justify-center gap-5 py-5 text-base disabled:bg-background/15 disabled:text-input disabled:opacity-70 md:w-10/12 [&_svg]:size-5"
            }
            disabled
          >
            <Icons.facebook className={"fill-[#316FF6]"} />
            Continue with Facebook
          </Button>

          <div className="mt-4 flex w-full items-center justify-center md:w-10/12">
            <div className="flex w-full items-center">
              <span className="w-full border-t" />
            </div>
            <div className={"relative flex justify-center text-xs uppercase"}>
              <span className={"px-2 text-input"}>OR</span>
            </div>
            <div className="flex w-full items-center">
              <span className="w-full border-t" />
            </div>
          </div>

          <Button
            className={
              "mt-4 w-full gap-5 border border-input bg-foreground/25 py-5 text-base text-input shadow-lg hover:bg-background/15 hover:text-input md:w-10/12 [&_svg]:size-5"
            }
            variant={"ghost"}
          >
            <Icons.key className={"fill-input text-input"} />
            Login with Passkey
          </Button>

          <div className="mt-4 flex w-full items-center justify-center md:w-10/12">
            <div className="flex w-full items-center">
              <span className="w-full border-t" />
            </div>
            <div className={"relative flex justify-center text-xs uppercase"}>
              <span className={"px-2 text-input"}>DISCLAIMER</span>
            </div>
            <div className="flex w-full items-center">
              <span className="w-full border-t" />
            </div>
          </div>

          <p className="mt-3 w-full text-center text-sm text-background/70 md:w-10/12">
            By continuing, you agree to our{" "}
            <Link
              href="/terms-of-services"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <Link href={"/"} className={"absolute right-1.5 top-1.5"}>
            <Button
              variant={"ghost"}
              className={"rounded-full hover:bg-background/20"}
              size={"icon"}
            >
              <House className={"text-primary"} />
            </Button>
          </Link>
        </div>

        <div className={"absolute top-0 -z-10 h-full w-full rounded-lg bg-foreground opacity-60"} />
      </div>

      <div
        className={cn(
          "absolute inset-0 -z-20",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d5bebe_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
        )}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]" />
    </div>
  );
};

export default Page;
