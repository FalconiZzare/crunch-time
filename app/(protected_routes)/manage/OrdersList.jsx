import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Package, User, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const OrdersList = ({ order, ...props }) => {
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
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
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
            <Badge className={getOrderStatusBadge(order.orderStatus)}>{order.orderStatus}</Badge>
            <Badge className={getPaymentStatusBadge(order.paymentStatus)}>
              {order.paymentStatus}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 pt-2.5">
        <div className="space-y-4">
          <div className="flex gap-3">
            <User className="mt-[5px] h-4 w-4 text-foreground/70" />
            <div>
              <p className="text-sm font-medium">{order.userName}</p>
              <p className="text-xs text-gray-500">ID: {order.userId.substring(0, 8)}...</p>
            </div>
          </div>

          <div className="flex gap-3">
            <MapPin className="mt-[5px] h-4 w-4 text-foreground/70" />
            <div>
              <p className="text-sm font-medium">Delivery Location</p>
              <p className="text-xs text-gray-500">{order.deliveryLocation}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Calendar className="mt-[5px] h-4 w-4 text-foreground/70" />
            <div>
              <p className="text-sm font-medium">Order Date</p>
              <p className="mt-[5px] text-xs text-foreground/70">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Clock className="mt-[5px] h-4 w-4 text-foreground/70" />
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="mt-[5px] text-xs text-foreground/70">{formatDate(order.lastUpdated)}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Package className="mt-[5px] h-4 w-4 text-foreground/70" />
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
        </div>
      </CardContent>
      {!order.isDelivered && (
        <CardFooter className="flex items-center justify-center gap-2 pb-4 pt-2">
          <Button
            variant={"ghost"}
            size="sm"
            className={
              "w-full border border-dashed border-primary/30 font-semibold tracking-wide hover:text-primary"
            }
          >
            INITIATE NEXT STATUS
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default OrdersList;
