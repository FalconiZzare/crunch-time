"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createOrder(data) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    throw new Error("You must be logged in to place an order");
  }

  const { items, deliveryLocation, deliveryCharge, paymentMethod } = data;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error("No items in your cart");
  }

  if (!deliveryLocation) throw new Error("Delivery location is required");
  try {
    const totalPrice = items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setHours(estimatedDeliveryTime.getHours() + 1);

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          totalPrice: totalPrice,
          deliveryCharge: deliveryCharge,
          deliveryLocation: deliveryLocation,
          paymentStatus: paymentMethod === "cod" ? "PENDING" : "PAID",
          estimatedDeliveryTime: estimatedDeliveryTime,

          carts: {
            create: items.map((item) => ({
              dishId: item.id,
              quantity: item.quantity
            }))
          },

          trackings: {
            create: {
              orderStatus: "PROCESSING"
            }
          }
        }
      });

      await tx.payment.create({
        data: {
          orderId: order.id,
          userId: session.user.id,
          amount: totalPrice + deliveryCharge,
          status: paymentMethod === "cod" ? "PENDING" : "PAID"
        }
      });

      return order;
    });

    revalidatePath("/orders");
  } catch (error) {
    console.error(error);
    throw new Error("Server Error!");
  }
}
