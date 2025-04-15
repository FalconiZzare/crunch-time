"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { headers } from "next/headers";

class OrderQueryStrategy {
  // where clause for Prisma
  getWhereClause() {
    throw new Error("Method 'getWhereClause' must be implemented");
  }

  // orderBy clause for Prisma
  getOrderByClause() {
    return { createdAt: "desc" };
  }

  // select clause for Prisma
  getSelectClause() {
    return {
      id: true,
      totalPrice: true,
      deliveryCharge: true,
      paymentStatus: true,
      createdAt: true,
      deliveryLocation: true,
      user: {
        select: {
          name: true,
          id: true
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
    };
  }

  formatOrderData(order) {
    const totalItemCount = order.carts.reduce((sum, item) => sum + item.quantity, 0);
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
  }
}

// Concrete Strategy: Pending Orders
class PendingOrdersStrategy extends OrderQueryStrategy {
  getWhereClause() {
    return {
      trackings: {
        some: {
          isDelivered: false
        }
      }
    };
  }
}

// Concrete Strategy: Completed Orders
class CompletedOrdersStrategy extends OrderQueryStrategy {
  getWhereClause() {
    return {
      trackings: {
        every: {
          isDelivered: true
        }
      }
    };
  }
}

// Concrete Strategy: Recent Orders (last 24 hours)
class RecentOrdersStrategy extends OrderQueryStrategy {
  getWhereClause() {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    return {
      createdAt: {
        gte: oneDayAgo
      }
    };
  }
}

// Context: Order Context with Strategy
class OrderContext {
  constructor(strategy) {
    this.strategy = strategy;
    this.prisma = null;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
    return this;
  }

  setPrisma(prisma) {
    this.prisma = prisma;
    return this;
  }

  // Executes the query using the current strategy
  async executeQuery({ limit = 50, page = 1 }) {
    if (!this.prisma) {
      throw new Error("Prisma client not set");
    }

    const skip = (page - 1) * limit;
    const whereClause = this.strategy.getWhereClause();
    const orderByClause = this.strategy.getOrderByClause();
    const selectClause = this.strategy.getSelectClause();

    // Get total count
    const totalCount = await this.prisma.order.count({
      where: whereClause
    });

    // Execute query with strategy parameters
    const orders = await this.prisma.order.findMany({
      where: whereClause,
      select: selectClause,
      orderBy: orderByClause,
      skip,
      take: limit
    });

    // Format data
    const formattedOrders = orders.map((order) => this.strategy.formatOrderData(order));

    // Return result
    return {
      payload: formattedOrders,
      count: totalCount,
      pages: Math.ceil(totalCount / limit)
    };
  }
}

// Factory for creating strategy instances
const OrderStrategyFactory = {
  createPendingOrdersStrategy() {
    return new PendingOrdersStrategy();
  },

  createCompletedOrdersStrategy() {
    return new CompletedOrdersStrategy();
  },

  createRecentOrdersStrategy() {
    return new RecentOrdersStrategy();
  }
};

// Usage in server action
export async function getOrders({ limit = 50, page = 1, strategyType = "pending" }) {
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
    // Create strategy based on type
    let strategy;
    switch (strategyType) {
      case "completed":
        strategy = OrderStrategyFactory.createCompletedOrdersStrategy();
        break;
      case "recent":
        strategy = OrderStrategyFactory.createRecentOrdersStrategy();
        break;
      case "pending":
      default:
        strategy = OrderStrategyFactory.createPendingOrdersStrategy();
    }

    // Create context with strategy and execute
    const orderContext = new OrderContext(strategy);
    orderContext.setPrisma(prisma);

    return await orderContext.executeQuery({ limit, page });
  } catch (error) {
    console.error(error);
    throw new Error("Server Error!");
  }
}
