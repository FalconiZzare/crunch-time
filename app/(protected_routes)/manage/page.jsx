import React from "react";
import AddDish from "@/app/(protected_routes)/manage/AddDish";
import { auth } from "@/auth";
import { headers } from "next/headers";
import ProtectedLayout from "@/components/ProtectedLayout";
import ListOrders from "@/app/(protected_routes)/manage/ListOrders";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <ProtectedLayout requiredRole={"administrator"} session={session}>
      <div>
        <AddDish />
        <ListOrders />
      </div>
    </ProtectedLayout>
  );
};

export default Page;
