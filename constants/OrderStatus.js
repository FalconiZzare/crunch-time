// Define the possible states an order can go through
export const ORDER_STATUS = {
  PROCESSING: "PROCESSING",
  PREPARING: "PREPARING",
  PICKEDUP: "PICKEDUP",
  ONTHEWAY: "ONTHEWAY",
  AROUNDTHECORNER: "AROUNDTHECORNER",
  DELIVERED: "DELIVERED",
  COLLECTCASH: "COLLECTCASH",
  COMPLETED: "COMPLETED"
};

export class OrderStatusService {
  constructor(order) {
    this.order = order;
    this.statusSequence = [
      ORDER_STATUS.PROCESSING,
      ORDER_STATUS.PREPARING,
      ORDER_STATUS.PICKEDUP,
      ORDER_STATUS.ONTHEWAY,
      ORDER_STATUS.AROUNDTHECORNER
    ];
  }

  progressStatus() {
    const currentIndex = this.statusSequence.indexOf(this.order.orderStatus);

    if (currentIndex < this.statusSequence.length - 1) {
      this.order.orderStatus = this.statusSequence[currentIndex + 1];
    } else if (this.order.orderStatus === ORDER_STATUS.AROUNDTHECORNER) {
      if (this.order.paymentStatus === "PENDING") {
        this.order.orderStatus = ORDER_STATUS.COLLECTCASH;
      } else {
        this.order.orderStatus = ORDER_STATUS.DELIVERED;
        this.order.isDelivered = true;
      }
    } else if (this.order.orderStatus === ORDER_STATUS.COLLECTCASH) {
      this.order.orderStatus = ORDER_STATUS.COMPLETED;
      this.order.paymentStatus = "PAID";
      this.order.isDelivered = true;
    }

    this.order.lastUpdated = new Date().toISOString();
    return this.order;
  }

  getNextStatus() {
    const currentIndex = this.statusSequence.indexOf(this.order.orderStatus);

    if (currentIndex < this.statusSequence.length - 1) {
      return this.statusSequence[currentIndex + 1];
    } else if (this.order.orderStatus === ORDER_STATUS.AROUNDTHECORNER) {
      return this.order.paymentStatus === "PENDING"
        ? ORDER_STATUS.COLLECTCASH
        : ORDER_STATUS.DELIVERED;
    } else if (this.order.orderStatus === ORDER_STATUS.COLLECTCASH) {
      return ORDER_STATUS.COMPLETED;
    }

    return null;
  }
}

// paymentService.js - Handles payment-related functionality
export class PaymentService {
  constructor(order) {
    this.order = order;
  }

  markAsPaid() {
    this.order.paymentStatus = "PAID";
    return this.order;
  }

  isPaid() {
    return this.order.paymentStatus === "PAID";
  }
}

// deliveryService.js - Handles delivery-related functionality
export class DeliveryService {
  constructor(order) {
    this.order = order;
  }

  markAsDelivered() {
    this.order.isDelivered = true;
    return this.order;
  }

  isDelivered() {
    return this.order.isDelivered;
  }
}
