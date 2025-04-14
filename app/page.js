import Container from "@/components/Container";
import TrueFocus from "@/components/ui/true-focus";
import Rice from "@/components/Home/Rice";
import Curry from "@/components/Home/Curry";
import Snacks from "@/components/Home/Snacks";
import Desserts from "@/components/Home/Desserts";
import Drinks from "@/components/Home/Drinks";
import StreetFood from "@/components/Home/StreetFood";

export default function Home() {
  return (
    <div>
      <Container
        className={"mt-[3.4rem] md:mt-[4.5rem]"}
        vClassName={"bg-[url('/images/food_back.jpg')] bg-cover bg-center bg-no-repeat shadow-lg"}
      >
        <div className={"px-4 py-10 md:py-16 xl:px-40 xl:py-48"}>
          <h1 className={"text-xl font-normal capitalize text-input xl:text-4xl"}>
            Welcome to
            <span className={"sr-only"}>Crunch Time</span>
          </h1>

          <TrueFocus
            sentence="CRUNCH TIME"
            manualMode={false}
            blurAmount={1}
            borderColor="hsl(var(--primary))"
            glowColor="hsl(var(--primary))"
            animationDuration={0.5}
            pauseBetweenAnimations={1.5}
            className={"mt-5 justify-start text-background"}
          />

          <p
            className={
              "mt-4 max-w-md text-sm font-normal capitalize tracking-wider text-input md:max-w-sm xl:text-lg"
            }
          >
            High quality ingredients mixed with excellent service is the best recipe for a
            successful food vendor.
          </p>
        </div>
      </Container>

      <Rice />
      <Curry />
      <Snacks />
      <Desserts />
      <Drinks />
      <StreetFood />
    </div>
  );
}
