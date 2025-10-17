// File: src/components/OrdersTable.jsx
import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MoreVertical,
  AlertCircle,
  Clock,
  Printer,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FaWhatsapp } from "react-icons/fa"; // Added for WhatsApp

// Constants for order statuses and their configurations
const ORDER_STATUSES = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  READY_FOR_PRINTING: {
    label: "Ready for Printing",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Printer,
  },
  PRINTING_IN_PROGRESS: {
    label: "Printing",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Printer,
  },
  PRINT_READY: {
    label: "Print Ready",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    icon: CheckCircle,
  },
  READY_FOR_DELIVERY: {
    label: "Ready for Delivery",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
};

// Department-specific status transitions
const DEPARTMENT_STATUS_ACTIONS = {
  preview: ["PENDING"],
  accounting: ["APPROVED", "REJECTED", "READY_FOR_PRINTING"],
  printing: ["PRINTING_IN_PROGRESS", "PRINT_READY"],
  delivery: ["READY_FOR_DELIVERY", "DELIVERED"],
  admin: Object.keys(ORDER_STATUSES),
};

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * OrdersTable Component - Displays and manages orders with department-specific functionality
 */
export function OrdersTable({
  department = "preview",
  orders = [],
  onStatusChange,
  onBulkAction,
  isLoading = false,
}) {
  const navigate = useNavigate();
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [filters, setFilters] = useState({
    status: "",
    customerSearch: "",
    paymentMode: "",
    urgent: false,
  });

  // Filter and paginate orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // ✅ Fixed: Handle "all" values properly
      const matchesStatus =
        !filters.status ||
        filters.status === "all" ||
        order.status === filters.status;
      const matchesCustomer =
        !filters.customerSearch ||
        order.customerName
          .toLowerCase()
          .includes(filters.customerSearch.toLowerCase()) ||
        order.customerPhone.includes(filters.customerSearch);
      const matchesPayment =
        !filters.paymentMode ||
        filters.paymentMode === "all" ||
        order.paymentMode === filters.paymentMode;
      const matchesUrgent = !filters.urgent || order.isUrgent;

      return (
        matchesStatus && matchesCustomer && matchesPayment && matchesUrgent
      );
    });
  }, [orders, filters]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredOrders.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredOrders, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  // Handle row selection
  const handleSelectRow = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    setSelectedOrders((prev) =>
      prev.length === paginatedOrders.length
        ? []
        : paginatedOrders.map((order) => order.id)
    );
  };

  // Get status badge configuration
  const getStatusBadge = (status, isUrgent) => {
    const statusConfig = ORDER_STATUSES[status] || ORDER_STATUSES.PENDING;
    const StatusIcon = statusConfig.icon;

    return (
      <div className="flex items-center gap-2">
        <Badge
          className={cn("flex items-center gap-1 border", statusConfig.color)}
        >
          <StatusIcon className="h-3 w-3" />
          {statusConfig.label}
        </Badge>
        {isUrgent && (
          <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">
            <AlertCircle className="h-3 w-3 mr-1" />
            Urgent
          </Badge>
        )}
      </div>
    );
  };

  // Get available status actions for current department
  const getAvailableStatusActions = () => {
    return DEPARTMENT_STATUS_ACTIONS[department] || [];
  };

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    if (onStatusChange) {
      await onStatusChange(orderId, newStatus);
    }
  };

  // Handle bulk action
  const handleBulkAction = async (action) => {
    if (onBulkAction && selectedOrders.length > 0) {
      await onBulkAction(selectedOrders, action);
      setSelectedOrders([]);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: "",
      customerSearch: "",
      paymentMode: "",
      urgent: false,
    });
    setCurrentPage(1);
  };

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-md animate-pulse" />
      ))}
    </div>
  );

  // Render mobile card view
  const renderMobileCard = (order) => (
    <Card
      key={order.id}
      className={cn(
        "mb-4 transition-all duration-200",
        order.isUrgent && "border-l-4 border-l-red-500 bg-red-50/30",
        selectedOrders.includes(order.id) && "ring-2 ring-blue-500"
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center text-base">
          <span
            className="cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            Order #{order.id}
          </span>
          <Checkbox
            checked={selectedOrders.includes(order.id)}
            onCheckedChange={() => handleSelectRow(order.id)}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div>
          <p className="text-sm font-medium text-gray-700">Customer</p>
          <p className="text-sm text-gray-900">{order.customerName}</p>
          <p className="text-xs text-gray-500">{order.customerPhone}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Status</p>
          {getStatusBadge(order.status, order.isUrgent)}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-700">Media Details</p>
          <img
            src={order.imageUrl}
            alt="Order Image"
            className="w-10 h-10 object-cover rounded-md border"
          />
          <p className="text-sm text-gray-900">
            {order.mediaType} - {order.measurements}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-700">Payment</p>
            <Badge
              className={cn(
                "text-xs",
                order.paymentStatus === "paid"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
              )}
            >
              {order.paymentMode}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <OrderActions
          order={order}
          department={department}
          onStatusChange={handleStatusChange}
        />
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* ✅ FIXED: Filters Section with Non-Empty Select Values */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={filters.customerSearch}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  customerSearch: e.target.value,
                }))
              }
              className="pl-10"
            />
          </div>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                status: value === "all" ? "" : value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(ORDER_STATUSES).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.paymentMode || "all"}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                paymentMode: value === "all" ? "" : value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Payment mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="full">Full Payment</SelectItem>
              <SelectItem value="partial">Partial Payment</SelectItem>
              <SelectItem value="cod">Cash on Delivery</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant={filters.urgent ? "default" : "outline"}
              onClick={() =>
                setFilters((prev) => ({ ...prev, urgent: !prev.urgent }))
              }
              className="flex-1"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Urgent Only
            </Button>
            <Button variant="outline" onClick={clearFilters} size="sm">
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedOrders.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-700 font-medium">
              {selectedOrders.length} order
              {selectedOrders.length > 1 ? "s" : ""} selected
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("print")}
                disabled={isLoading}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("status")}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Status
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedOrders([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Results Info */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Showing {paginatedOrders.length} of {filteredOrders.length} orders
        </span>
        {filters.customerSearch ||
        filters.status ||
        filters.paymentMode ||
        filters.urgent ? (
          <span>({orders.length} total orders)</span>
        ) : null}
      </div>

      {/* Table/Cards View */}
      {isLoading ? (
        renderSkeleton()
      ) : paginatedOrders.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Printer className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500 mb-4">
                {filters.customerSearch ||
                filters.status ||
                filters.paymentMode ||
                filters.urgent
                  ? "No orders match your current filters."
                  : "Get started by creating your first order."}
              </p>
            </div>
            <div className="flex gap-2">
              {filters.customerSearch ||
              filters.status ||
              filters.paymentMode ||
              filters.urgent ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : null}
              <Button onClick={() => navigate("/orders/create")}>
                Create New Order
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:block">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      {/* ✅ FIXED: Removed indeterminate prop */}
                      <Checkbox
                        checked={
                          selectedOrders.length === paginatedOrders.length &&
                          paginatedOrders.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer Info</TableHead>
                    <TableHead>Media Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className={cn(
                        "hover:bg-muted/50 transition-colors",
                        order.isUrgent &&
                          "border-l-4 border-l-red-500 bg-red-50/30",
                        selectedOrders.includes(order.id) && "bg-blue-50/50"
                      )}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={() => handleSelectRow(order.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <span
                          className="cursor-pointer hover:text-blue-600 transition-colors font-medium"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          #{order.id}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.customerName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.customerPhone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={order.imageUrl}
                            alt="Order Image"
                            className="w-10 h-10 object-cover rounded-md border"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.mediaType}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.measurements}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status, order.isUrgent)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "border",
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          )}
                        >
                          {order.paymentMode}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <OrderActions
                          order={order}
                          department={department}
                          onStatusChange={handleStatusChange}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            {paginatedOrders.map((order) => renderMobileCard(order))}
          </div>
        </>
      )}

      {/* Pagination */}
      {paginatedOrders.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROWS_PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option} rows per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// PropTypes validation
OrdersTable.propTypes = {
  department: PropTypes.oneOf([
    "preview",
    "accounting",
    "printing",
    "delivery",
    "admin",
  ]),
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      customerName: PropTypes.string.isRequired,
      customerPhone: PropTypes.string.isRequired,
      mediaType: PropTypes.string,
      measurements: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      isUrgent: PropTypes.bool,
      paymentMode: PropTypes.string.isRequired,
      paymentStatus: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      imageUrl: PropTypes.string, // Added imageUrl
    })
  ),
  onStatusChange: PropTypes.func,
  onBulkAction: PropTypes.func,
  isLoading: PropTypes.bool,
};

// Internal Actions component
function OrderActions({ order, department, onStatusChange }) {
  const navigate = useNavigate();
  const availableActions = DEPARTMENT_STATUS_ACTIONS[department] || [];

  const handleWhatsappUpdate = () => {
    const message = `Your order ${order.id} status is now ${order.status}. Thank you for choosing RD Wallpaper!`;
    window.open(
      `https://wa.me/${order.customerPhone}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/orders/${order.id}`)}
      >
        <Eye className="h-4 w-4" />
      </Button>

      {availableActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {availableActions.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => onStatusChange(order.id, status)}
              >
                {ORDER_STATUSES[status]?.label || status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleWhatsappUpdate}
        className="text-green-600"
      >
        <FaWhatsapp className="h-4 w-4" />
      </Button>
    </div>
  );
}

OrderActions.propTypes = {
  order: PropTypes.object.isRequired,
  department: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};
