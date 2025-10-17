import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { Loader2 } from "lucide-react";
import { useOrders } from "../context/OrderContext";
import { format } from "date-fns";
import ChargingDetails from "./ChargingDetails";

export function OrderDetail() {
  const { orderId } = useParams();
  const { getOrder, loading: contextLoading, updatePayment } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderAndCustomer = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching order...", orderId);
        const orderData = await getOrder(orderId);
        setOrder(orderData);
        console.log("Order fetched:", orderData);


      } catch (error) {
        console.error("Error fetching order details:", error);
        setError(error.message || "Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderAndCustomer();
    }
  }, [orderId, getOrder]); // Ensure dependencies are stable

  if (loading || contextLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Order not found
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Charging Details Section */}
      <ChargingDetails order={order} updatePayment={updatePayment} />

      {/* Order Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details: {order.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Order ID</p>
            <p className="text-lg font-bold">{order.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Total Amount</p>
            <p className="text-md">₹{order.totalAmount?.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Status</p>
            <p className="text-md">{order.status}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Payment Status</p>
            <p className="text-md">{order.paymentStatus}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Priority</p>
            <p className="text-md">{order.priority}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Media Type</p>
            <p className="text-md">{order.mediaType}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Measurements</p>
            <p className="text-md">{order.measurements}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Image URL</p>
            <a
              href={order.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {order.imageUrl}
            </a>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              Delivery Address
            </p>
            <p className="text-md">
              {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
              {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              Expected Delivery
            </p>
            <p className="text-md">
              {format(new Date(order.expectedDeliveryDate), "PPP")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Created At</p>
            <p className="text-md">
              {format(new Date(order.createdAt), "PPP p")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Last Updated</p>
            <p className="text-md">
              {format(new Date(order.updatedAt), "PPP p")}
            </p>
          </div>
          {order.items && order.items.length > 0 && (
            <div>
              <p className="text-lg font-semibold mt-4 mb-2">Order Items</p>
              {order.items.map((item, index) => (
                <div key={index} className="border p-3 rounded-md mb-2">
                  <p>Media ID: {item.mediaId}</p>
                  <p>
                    Dimensions: {item.width}x{item.height}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ₹{item.price?.toFixed(2)}</p>
                  {item.notes && <p>Notes: {item.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>


    </div>
  );
}
