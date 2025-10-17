import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const paymentStatusColors = {
  paid: "bg-purple-100 text-purple-800",
  unpaid: "bg-red-100 text-red-800",
  cod: "bg-blue-100 text-blue-800",
  monthly: "bg-purple-100 text-purple-800",
};

const orderStatusColors = {
  completed: "bg-purple-100 text-purple-800",
  pending: "bg-blue-100 text-blue-800",
  urgent: "bg-red-100 text-red-800",
};

const logisticsStatusColors = {
  normal: "bg-green-100 text-green-800",
  efficient: "bg-blue-100 text-blue-800", 
  alert: "bg-red-100 text-red-800",
};

export function OrdersTable({ orders = [], isLogistics = false }) {
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-6 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-[#013763]">
          {isLogistics ? "Recent Activities" : "Recent Orders"}
        </h2>
      </div>

      {orders.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {isLogistics ? (
                    <>
                      <TableHead className="text-gray-700">Time</TableHead>
                      <TableHead className="text-gray-700">Trip ID</TableHead>
                      <TableHead className="text-gray-700">Vehicle</TableHead>
                      <TableHead className="text-gray-700">Fuel</TableHead>
                      <TableHead className="text-gray-700">Variance</TableHead>
                      <TableHead className="text-gray-700">Status</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead className="text-gray-700">Order ID</TableHead>
                      <TableHead className="text-gray-700">Party Name</TableHead>
                      <TableHead className="text-gray-700">Media</TableHead>
                      <TableHead className="text-gray-700">Size (sq. ft)</TableHead>
                      <TableHead className="text-gray-700">Amount</TableHead>
                      <TableHead className="text-gray-700">Payment</TableHead>
                      <TableHead className="text-gray-700">Status</TableHead>
                      <TableHead className="text-gray-700">Date</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    {isLogistics ? (
                      <>
                        <TableCell className="font-medium">{item.time}</TableCell>
                        <TableCell>{item.tripId}</TableCell>
                        <TableCell>{item.vehicle}</TableCell>
                        <TableCell>{item.fuel}</TableCell>
                        <TableCell className={item.variance.startsWith('+') ? "text-red-600" : "text-green-600"}>
                          {item.variance}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              logisticsStatusColors[item.status] ||
                              "bg-gray-100 text-gray-800"
                            }
                          >
                            {item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.partyName}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            <span>{item.media.icon}</span>
                            {item.media.type}
                          </span>
                        </TableCell>
                        <TableCell>{item.sqFt}</TableCell>
                        <TableCell>₹{item.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              paymentStatusColors[item.paymentStatus] ||
                              "bg-gray-100 text-gray-800"
                            }
                          >
                            {item.paymentStatus.charAt(0).toUpperCase() +
                              item.paymentStatus.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              orderStatusColors[item.orderStatus] ||
                              "bg-gray-100 text-gray-800"
                            }
                          >
                            {item.orderStatus.charAt(0).toUpperCase() +
                              item.orderStatus.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(item.date, "MMM d, yyyy")}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Showing {orders.length} {isLogistics ? "activities" : "orders"}
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-gray-500">
          No {isLogistics ? "activities" : "orders"} found matching your filters
        </div>
      )}
    </div>
  );
}
