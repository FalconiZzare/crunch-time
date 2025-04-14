import React from "react";
import Container from "@/components/Container";
import { Salad } from "lucide-react";
import Image from "next/image";

const Rice = () => {
  return (
    <Container id="rice">
      <div className={"flex items-center gap-3"}>
        <Salad className={"size-8 text-primary md:size-9"} />
        <p className={"text-lg font-semibold md:text-xl"}>Rice Dishes</p>
      </div>
      <div className={"grid grid-cols-6"}>
        {Array(10)
          .fill(null)
          .map((_, i) => (
            <div key={i} className={"flex border-dashed"}>
              <div>
                <Image src={"/images/burger.png"} alt={"burger"} height={100} width={100} />
                <div>Hello</div>
              </div>
            </div>
          ))}
      </div>
    </Container>
  );
};

export default Rice;
