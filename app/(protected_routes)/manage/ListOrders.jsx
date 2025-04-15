"use client";

import React from "react";
import Container from "@/components/Container";
import { NotebookPen } from "lucide-react";
import SectionHeader from "@/app/(protected_routes)/manage/SectionHeader";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/actions/getOrders";

const ListOrders = () => {
  const { data: orders, isPending } = useQuery({
    queryKey: ["getOrders"],
    queryFn: async () => {
      return await getOrders({ limit: 100, page: 1 });
    }
  });

  console.log(orders);

  return (
    <Container>
      <SectionHeader title={"Pending Orders"}>
        <NotebookPen className={"size-8 text-primary md:size-9"} />
      </SectionHeader>
      <div className="grid grid-cols-1 place-items-center gap-x-2 gap-y-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"></div>
    </Container>
  );
};

export default ListOrders;
