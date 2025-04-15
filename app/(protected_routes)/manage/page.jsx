import React from "react";
import AddDish from "@/app/(protected_routes)/manage/AddDish";
import { auth } from "@/auth";
import { headers } from "next/headers";
import ProtectedLayout from "@/components/ProtectedLayout";
import PendingOrders from "@/app/(protected_routes)/manage/PendingOrders";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <ProtectedLayout requiredRole={"administrator"} session={session}>
      <div>
        <AddDish />
        <PendingOrders />
      </div>
    </ProtectedLayout>
  );
};

export default Page;
