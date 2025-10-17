import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useToast } from "../../../hooks/use-toast";
import axios from "axios";

const OrderContext = createContext();

const MOCK_ORDERS = [
  {
    id: "BOOK003",
    customerId: "CUST001",
    items: [
      {
        mediaId: "MED001",
        width: 48,
        height: 36,
        quantity: 2,
        price: 1200,
        notes: "High quality finish needed",
      },
    ],
    status: "PENDING",
    priority: "NORMAL",
    paymentStatus: "PENDING",
    totalAmount: 2400,
    deliveryAddress: {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },
    expectedDeliveryDate: new Date("2025-09-01"),
    createdAt: new Date("2025-08-25"),
    updatedAt: new Date("2025-08-25"),
    customerName: "John Doe", // Add customer name for OrdersTable
    customerPhone: "+91 9876543210", // Add customer phone for OrdersTable
    mediaType: "Canvas Print", // Add mediaType
    measurements: "48x36 inches", // Add measurements
    imageUrl: "https://via.placeholder.com/150", // Add imageUrl
    isUrgent: false, // Add isUrgent
    paymentMode: "full", // Add paymentMode
  },
];

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // CRUD Operations
  const createOrder = useCallback(
    async (orderData) => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newOrder = {
          id: `ORD${Math.random().toString(36).substr(2, 9)}`,
          ...orderData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setOrders((prev) => [...prev, newOrder]);

        toast({
          title: "Order Created",
          description: `Order #${newOrder.id} has been created successfully`,
        });

        return newOrder;
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to create order",
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const updateOrder = useCallback(
    async (orderId, orderData) => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? { ...order, ...orderData, updatedAt: new Date() }
              : order
          )
        );

        toast({
          title: "Order Updated",
          description: `Order #${orderId} has been updated successfully`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to update order",
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const deleteOrder = useCallback(
    async (orderId) => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setOrders((prev) => prev.filter((order) => order.id !== orderId));

        toast({
          title: "Order Deleted",
          description: `Order #${orderId} has been deleted successfully`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete order",
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const getOrder = useCallback(
    async (orderId) => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        const order = orders.find((o) => o.id === orderId);
        if (!order) throw new Error("Order not found");

        return order;
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch order",
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [orders, toast]
  );

  // Status Updates
  const updateOrderStatus = useCallback(
    async (orderId, status, notes) => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  statusHistory: [
                    ...(order.statusHistory || []),
                    { status, notes, timestamp: new Date() },
                  ],
                  updatedAt: new Date(),
                }
              : order
          )
        );

        toast({
          title: "Status Updated",
          description: `Order #${orderId} status changed to ${status}`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to update status",
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  // Payment Updates
  const updatePayment = useCallback(
    async (orderId, paymentData) => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  paymentDetails: {
                    ...(order.paymentDetails || {}),
                    ...paymentData,
                  },
                  paymentStatus:
                    paymentData.status === "CHARGED" ? "PAID" : "PENDING",
                  updatedAt: new Date(),
                }
              : order
          )
        );

        toast({
          title: "Payment Updated",
          description: `Payment details updated for Order #${orderId}`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to update payment",
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  // Filters and Stats
  const getOrdersByStatus = useCallback(
    (status) => {
      return orders.filter((order) => order.status === status);
    },
    [orders]
  );

  const getOrdersByPaymentStatus = useCallback(
    (paymentStatus) => {
      return orders.filter((order) => order.paymentStatus === paymentStatus);
    },
    [orders]
  );

  const getUrgentOrders = useCallback(() => {
    return orders.filter((order) => order.priority === "URGENT");
  }, [orders]);

  const getOrderStats = useCallback(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "PENDING").length,
      printing: orders.filter((o) =>
        ["READY_FOR_PRINTING", "PRINTING_IN_PROGRESS"].includes(o.status)
      ).length,
      delivery: orders.filter((o) => o.status === "READY_FOR_DELIVERY").length,
      completed: orders.filter((o) => o.status === "DELIVERED").length,
    };
  }, [orders]);

  const contextValue = useMemo(
    () => ({
      orders,
      loading,
      createOrder,
      updateOrder,
      deleteOrder,
      getOrder,
      updateOrderStatus,
      updatePayment,
      getOrdersByStatus,
      getOrdersByPaymentStatus,
      getUrgentOrders,
      getOrderStats,
    }),
    [
      orders,
      loading,
      createOrder,
      updateOrder,
      deleteOrder,
      getOrder,
      updateOrderStatus,
      updatePayment,
      getOrdersByStatus,
      getOrdersByPaymentStatus,
      getUrgentOrders,
      getOrderStats,
    ]
  );

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
