import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Package, User, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  OrderStatusService,
  PaymentService,
  DeliveryService,
  ORDER_STATUS
} from "@/constants/OrderStatus";
import { triggerToast } from "@/lib/utils";
import { updateOrder } from "@/actions/updateOrder";

const OrdersList = ({ order: initialOrder, ...props }) => {
  class OrderFacade {
    constructor() {
      this.callCount = 0;
    }

    initWithOrder(order) {
      this.order = { ...order };
      this.statusService = new OrderStatusService(this.order);
      this.paymentService = new PaymentService(this.order);
      this.deliveryService = new DeliveryService(this.order);
      return this;
    }

    processNextStep() {
      this.callCount++;

      const updatedOrder = this.statusService.progressStatus();
      const prevStatus = this.order.orderStatus;

      // Check if this step completed the order
      if (
        updatedOrder.orderStatus === ORDER_STATUS.DELIVERED ||
        updatedOrder.orderStatus === ORDER_STATUS.COMPLETED
      ) {
        if (!this.deliveryService.isDelivered()) {
          this.deliveryService.markAsDelivered();
        }
      }

      // Handle cash collection specifically
      if (updatedOrder.orderStatus === ORDER_STATUS.COLLECTCASH && !this.paymentService.isPaid()) {
        this.paymentService.markAsPaid();
        updatedOrder.orderStatus = ORDER_STATUS.COMPLETED;
        this.deliveryService.markAsDelivered();
      }

      return {
        updatedOrder: this.order,
        previousStatus: prevStatus
      };
    }

    getNextStatus() {
      return this.statusService.getNextStatus();
    }
  }

  const [order, setOrder] = useState(initialOrder);
  const [facade] = useState(() => new OrderFacade().initWithOrder(initialOrder));
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      return await updateOrder({
        orderId: data.orderId,
        orderStatus: data.orderStatus,
        isDelivered: data.isDelivered,
        cashCollected: data.paymentStatus === "PAID"
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["getOrders"] });
      queryClient.invalidateQueries({ queryKey: ["getCompleteOrders"] });

      const newStatusName = getStatusDisplayName(variables.orderStatus);
      triggerToast(`Status updated: ${newStatusName}`);

      if (variables.orderStatus === ORDER_STATUS.COLLECTCASH) {
        triggerToast("Collecting payment from customer");
      }

      // If order completed
      if (variables.orderStatus === ORDER_STATUS.COMPLETED) {
        triggerToast("Order completed and payment received!");
      }
    }
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getOrderStatusBadge = (status) => {
    const statusColors = {
      PROCESSING: "bg-blue-100 text-blue-800",
      PREPARING: "bg-purple-100 text-purple-800",
      PICKEDUP: "bg-indigo-100 text-indigo-800",
      ONTHEWAY: "bg-cyan-100 text-cyan-800",
      AROUNDTHECORNER: "bg-teal-100 text-teal-800",
      COLLECTCASH: "bg-amber-100 text-amber-800",
      DELIVERED: "bg-green-100 text-green-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800"
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusBadge = (status) => {
    const statusColors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PAID: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800"
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusDisplayName = (status) => {
    const statusNames = {
      PROCESSING: "Processing",
      PREPARING: "Preparing",
      PICKEDUP: "Picked Up",
      ONTHEWAY: "On The Way",
      AROUNDTHECORNER: "Around The Corner",
      COLLECTCASH: "Collecting Payment",
      DELIVERED: "Delivered",
      COMPLETED: "Completed"
    };
    return statusNames[status] || status;
  };

  const handleProgressStatus = () => {
    if (isPending) return;

    const { updatedOrder } = facade.processNextStep();
    setOrder({ ...updatedOrder });

    mutate(updatedOrder);
  };

  const nextStatus = facade.getNextStatus();

  const showButton = nextStatus !== null;

  const buttonText = nextStatus ? `NEXT: ${getStatusDisplayName(nextStatus)}` : "COMPLETED";

  return (
    <Card
      className="mx-auto h-full w-full max-w-md border border-dashed border-primary/20 shadow-lg"
      {...props}
    >
      <CardHeader className="border-b border-foreground/40 pb-2.5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            Order <span className={"text-xs uppercase"}>#{order.orderId.substring(0, 7)}</span>
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={getOrderStatusBadge(order.orderStatus)}>
              {getStatusDisplayName(order.orderStatus)}
            </Badge>
            <Badge className={getPaymentStatusBadge(order.paymentStatus)}>
              {order.paymentStatus}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 pt-2.5">
        <div className="space-y-4">
          <div className="flex gap-3">
            <User className="mt-1 h-4 w-4 text-foreground/70" />
            <div>
              <p className="text-sm font-medium">{order.userName}</p>
              <p className="text-xs text-gray-500">ID: {order.userId.substring(0, 8)}...</p>
            </div>
          </div>

          <div className="flex gap-3">
            <MapPin className="mt-1 h-4 w-4 text-foreground/70" />
            <div>
              <p className="text-sm font-medium">Delivery Location</p>
              <p className="text-xs text-gray-500">{order.deliveryLocation}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Calendar className="mt-1 h-4 w-4 text-foreground/70" />
            <div>
              <p className="text-sm font-medium">Order Date</p>
              <p className="mt-0.5 text-xs text-foreground/70">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Clock className="mt-1 h-4 w-4 text-foreground/70" />
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="mt-0.5 text-xs text-foreground/70">{formatDate(order.lastUpdated)}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Package className="mt-1 h-4 w-4 text-foreground/70" />
            <div>
              <p className="text-sm font-medium">Order Details</p>
              <div className={"flex items-center gap-4"}>
                <p className="text-xs text-gray-500">
                  {`${order.totalItemCount} ${order.totalItemCount > 1 ? "items" : "item"}`}
                </p>
                <div className="text-xs">
                  <span className="font-medium text-gray-500">Total:</span>
                  <span className="ml-1 text-right font-medium">৳&nbsp;{order.grandTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {order.orderStatus === "COMPLETED" && (
            <div className="mt-4 rounded bg-green-50 p-2 text-center text-sm text-green-800">
              Order completed and payment received
            </div>
          )}
        </div>
      </CardContent>
      {showButton && (!order.isDelivered || order.orderStatus === "COLLECTCASH") && (
        <CardFooter className="flex items-center justify-center gap-2 pb-4 pt-2">
          <Button
            variant={"ghost"}
            size="sm"
            className={
              "w-full border border-dashed border-primary/30 font-semibold tracking-wide hover:text-primary"
            }
            onClick={handleProgressStatus}
            disabled={isPending}
          >
            {isPending ? "UPDATING..." : buttonText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default OrdersList;
