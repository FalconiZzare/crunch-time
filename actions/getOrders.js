"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function getOrders({ limit = 50, page = 1 }) {
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
    const skip = (page - 1) * limit;

    const totalCount = await prisma.order.count({
      where: {
        trackings: {
          some: {
            isDelivered: false
          }
        }
      }
    });

    const orders = await prisma.order.findMany({
      where: {
        trackings: {
          some: {
            isDelivered: false
          }
        }
      },
      select: {
        id: true,
        totalPrice: true,
        deliveryCharge: true,
        paymentStatus: true,
        createdAt: true,
        deliveryLocation: true,
        user: {
          select: {
            name: true
          }
        },
        trackings: {
          select: {
            orderStatus: true,
            isDelivered: true,
            updatedAt: true
          },
          orderBy: {
            createdAt: "asc"
          },
          take: 1
        },
        carts: {
          select: {
            quantity: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit
    });

    // Transform the data to match the requested format
    const formattedOrders = orders.map((order) => {
      // Calculate total item count
      const totalItemCount = order.carts.reduce((sum, item) => sum + item.quantity, 0);

      // Get latest tracking status
      const latestTracking = order.trackings[0] || {};

      return {
        orderId: order.id,
        userName: order.user.name,
        userId: order.user.id,
        totalPrice: order.totalPrice,
        deliveryCharge: order.deliveryCharge,
        grandTotal: order.totalPrice + order.deliveryCharge,
        totalItemCount,
        paymentStatus: order.paymentStatus,
        orderStatus: latestTracking.orderStatus || "UNKNOWN",
        isDelivered: latestTracking.isDelivered || false,
        deliveryLocation: order.deliveryLocation,
        createdAt: order.createdAt,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        lastUpdated: latestTracking.updatedAt || order.updatedAt
      };
    });

    return {
      payload: formattedOrders,
      count: totalCount,
      pages: Math.ceil(totalCount / limit)
    };
  } catch (error) {
    console.error(error);
    throw new Error("Server Error!");
  }
}
