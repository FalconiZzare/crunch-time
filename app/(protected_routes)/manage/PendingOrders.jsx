"use client";

import React from "react";
import Container from "@/components/Container";
import { LoaderCircle, NotebookPen } from "lucide-react";
import SectionHeader from "@/app/(protected_routes)/manage/SectionHeader";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/actions/getOrders";
import OrdersList from "@/app/(protected_routes)/manage/OrdersList";

const ListOrders = () => {
  const { data: orders, isPending } = useQuery({
    queryKey: ["getOrders"],
    queryFn: async () => {
      return await getOrders({ limit: 100, page: 1 });
    }
  });

  return (
    <Container>
      <SectionHeader title={"Pending Orders"}>
        <NotebookPen className={"size-8 text-primary md:size-9"} />
      </SectionHeader>
      <div className="mt-4 grid grid-cols-1 place-items-center gap-x-2 gap-y-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isPending ? (
          <div className={"col-span-4 py-20 text-center"}>
            <LoaderCircle className={"animate-spin text-primary"} size={36} />
          </div>
        ) : orders && orders.payload.length > 0 ? (
          orders.payload.map((order) => <OrdersList key={order.orderId} order={order} />)
        ) : (
          <div className={"col-span-4 py-20 text-center"}>
            <p>No Pending Orders Found</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ListOrders;
