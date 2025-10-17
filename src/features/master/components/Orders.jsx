// File: src/components/Orders.jsx
import React, { useState } from "react";
import { OrdersTable } from "./OrdersTable";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

// Mock data - replace with actual API call, added imageUrl
const mockOrders = [
  {
    id: "ORD001",
    customerName: "John Doe",
    customerPhone: "+91 9876543210",
    mediaType: "Vinyl",
    measurements: "100cm x 200cm",
    status: "PENDING",
    isUrgent: true,
    paymentMode: "partial",
    paymentStatus: "pending",
    createdAt: new Date().toISOString(),
    imageUrl: "https://via.placeholder.com/150?text=ORD001", // Added imageUrl
  },
  {
    id: "ORD002",
    customerName: "Jane Smith",
    customerPhone: "+91 9876543211",
    mediaType: "Paper",
    measurements: "50cm x 75cm",
    status: "APPROVED",
    isUrgent: false,
    paymentMode: "full",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    imageUrl: "https://via.placeholder.com/150?text=ORD002", // Added imageUrl
  },
  {
    id: "ORD003",
    customerName: "Mike Johnson",
    customerPhone: "+91 9876543212",
    mediaType: "Canvas",
    measurements: "75cm x 100cm",
    status: "PRINTING_IN_PROGRESS",
    isUrgent: false,
    paymentMode: "cod",
    paymentStatus: "pending",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    imageUrl: "https://via.placeholder.com/150?text=ORD003", // Added imageUrl
  },
  {
    id: "ORD004",
    customerName: "Sarah Wilson",
    customerPhone: "+91 9876543213",
    mediaType: "Banner",
    measurements: "200cm x 300cm",
    status: "DELIVERED",
    isUrgent: false,
    paymentMode: "full",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    imageUrl: "https://via.placeholder.com/150?text=ORD004", // Added imageUrl
  },
];

export function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(mockOrders);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast({
        title: "Status updated successfully",
        description: `Order ${orderId} has been updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error updating status",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAction = async (orderIds, action) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (action === "print") {
        toast({
          title: "Print job started",
          description: `Started printing ${orderIds.length} orders`,
        });
      } else if (action === "status") {
        toast({
          title: "Status updated",
          description: `Updated status for ${orderIds.length} orders`,
        });
      }
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast({
        title: "Error performing bulk action",
        description: "Failed to perform bulk action. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
          <p className="text-gray-600">
            Manage and track all your wallpaper orders
          </p>
        </div>
        <Button
          onClick={() => navigate("/orders/create")}
          className="mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Order
        </Button>
      </div>

      {/* Orders Table */}
      <OrdersTable
        department="preview" // TODO: Get from auth context
        orders={orders}
        onStatusChange={handleStatusChange}
        onBulkAction={handleBulkAction}
        isLoading={isLoading}
      />
    </div>
  );
}
