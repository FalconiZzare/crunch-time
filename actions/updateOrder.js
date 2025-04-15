"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function updateOrder({ orderId, orderStatus, isDelivered, cashCollected = false }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    throw new Error("Session not found");
  }

  if (session.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const updatedTracking = await tx.tracking.update({
        where: {
          orderId: orderId
        },
        data: {
          orderStatus: orderStatus,
          isDelivered: isDelivered
        }
      });

      if (cashCollected) {
        await tx.payment.update({
          where: {
            orderId: orderId
          },
          data: {
            status: "PAID",
            processingTime: new Date()
          }
        });

        await tx.order.update({
          where: {
            id: orderId
          },
          data: {
            paymentStatus: "PAID"
          }
        });
      }

      return updatedTracking;
    });
  } catch (error) {
    console.error(error);
    throw new Error("Server Error!");
  }
}
