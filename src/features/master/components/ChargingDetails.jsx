import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "../utils/orderStatusHelpers";

export default function ChargingDetails({ order, onPaymentUpdate }) {
  const { toast } = useToast();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  const handlePaymentUpdate = async () => {
    try {
      const amount = parseFloat(paymentAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }

      await onPaymentUpdate(amount);
      setIsUpdateDialogOpen(false);
      setPaymentAmount("");
      toast({
        title: "Payment Updated",
        description: `Successfully updated payment with ${formatCurrency(
          amount
        )}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment",
        variant: "destructive",
      });
    }
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PARTIALLY_PAID: "bg-blue-100 text-blue-800",
      PAID: "bg-green-100 text-green-800",
      REFUNDED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const calculateRemainingAmount = () => {
    const totalAmount = parseFloat(order.totalAmount) || 0;
    const paidAmount = parseFloat(order.paidAmount) || 0;
    return Math.max(0, totalAmount - paidAmount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Payment Status</p>
            <Badge className={getPaymentStatusColor(order.paymentStatus)}>
              {order.paymentStatus}
            </Badge>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-sm text-gray-500">Payment Mode</p>
            <p className="font-medium">{order.paymentMode}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="font-semibold flex items-center">
              <IndianRupee className="h-4 w-4 mr-1" />
              {formatCurrency(order.totalAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Paid Amount</p>
            <p className="font-semibold flex items-center">
              <IndianRupee className="h-4 w-4 mr-1" />
              {formatCurrency(order.paidAmount || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Remaining</p>
            <p className="font-semibold flex items-center">
              <IndianRupee className="h-4 w-4 mr-1" />
              {formatCurrency(calculateRemainingAmount())}
            </p>
          </div>
        </div>

        {order.paymentStatus !== "PAID" && (
          <Dialog
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-full mt-4">Update Payment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Payment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Payment Amount</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-9"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={handlePaymentUpdate}
                  disabled={!paymentAmount}
                >
                  Confirm Payment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
