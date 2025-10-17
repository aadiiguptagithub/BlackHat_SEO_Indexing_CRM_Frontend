// Order status constants
export const ORDER_STATUSES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  READY_FOR_PRINTING: "READY_FOR_PRINTING",
  PRINTING_IN_PROGRESS: "PRINTING_IN_PROGRESS",
  PRINT_READY: "PRINT_READY",
  READY_FOR_DELIVERY: "READY_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  REJECTED: "REJECTED",
  REPLACEMENT_REQUESTED: "REPLACEMENT_REQUESTED",
};

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PARTIALLY_PAID: "PARTIALLY_PAID",
  PAID: "PAID",
  REFUNDED: "REFUNDED",
};

// Priority levels
export const PRIORITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
};

// Get next status in workflow
export const getNextStatus = (currentStatus) => {
  const workflow = {
    [ORDER_STATUSES.PENDING]: ORDER_STATUSES.APPROVED,
    [ORDER_STATUSES.APPROVED]: ORDER_STATUSES.READY_FOR_PRINTING,
    [ORDER_STATUSES.READY_FOR_PRINTING]: ORDER_STATUSES.PRINTING_IN_PROGRESS,
    [ORDER_STATUSES.PRINTING_IN_PROGRESS]: ORDER_STATUSES.PRINT_READY,
    [ORDER_STATUSES.PRINT_READY]: ORDER_STATUSES.READY_FOR_DELIVERY,
    [ORDER_STATUSES.READY_FOR_DELIVERY]: ORDER_STATUSES.DELIVERED,
  };

  return workflow[currentStatus] || currentStatus;
};

// Check if user can transition order to target status
export const canTransitionTo = (
  currentStatus,
  targetStatus,
  userDepartment
) => {
  const departmentPermissions = {
    preview: [ORDER_STATUSES.PENDING],
    accounting: [ORDER_STATUSES.APPROVED, ORDER_STATUSES.REJECTED],
    printing: [
      ORDER_STATUSES.READY_FOR_PRINTING,
      ORDER_STATUSES.PRINTING_IN_PROGRESS,
      ORDER_STATUSES.PRINT_READY,
    ],
    delivery: [ORDER_STATUSES.READY_FOR_DELIVERY, ORDER_STATUSES.DELIVERED],
    admin: Object.values(ORDER_STATUSES),
  };

  return departmentPermissions[userDepartment]?.includes(targetStatus) || false;
};

// Get status color and styling
export const getStatusStyle = (status, priority) => {
  const statusStyles = {
    [ORDER_STATUSES.PENDING]: "bg-yellow-100 text-yellow-800 border-yellow-200",
    [ORDER_STATUSES.APPROVED]: "bg-green-100 text-green-800 border-green-200",
    [ORDER_STATUSES.READY_FOR_PRINTING]:
      "bg-blue-100 text-blue-800 border-blue-200",
    [ORDER_STATUSES.PRINTING_IN_PROGRESS]:
      "bg-purple-100 text-purple-800 border-purple-200",
    [ORDER_STATUSES.PRINT_READY]:
      "bg-indigo-100 text-indigo-800 border-indigo-200",
    [ORDER_STATUSES.READY_FOR_DELIVERY]:
      "bg-orange-100 text-orange-800 border-orange-200",
    [ORDER_STATUSES.DELIVERED]: "bg-green-100 text-green-800 border-green-200",
    [ORDER_STATUSES.REJECTED]: "bg-red-100 text-red-800 border-red-200",
  };

  let baseStyle =
    statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200";

  // Add urgency styling
  if (priority === PRIORITY_LEVELS.URGENT) {
    baseStyle += " animate-pulse ring-2 ring-red-300";
  }

  return baseStyle;
};

// Calculate estimated completion time
export const calculateCompletionTime = (startTime, estimatedDuration) => {
  if (!startTime || !estimatedDuration) return null;

  const start = new Date(startTime);
  const hours = parseInt(estimatedDuration.split(" ")[0]) || 0;
  const completion = new Date(start.getTime() + hours * 60 * 60 * 1000);

  return completion;
};

// Format production time for display
export const formatProductionTime = (hours) => {
  if (hours < 1) return `${Math.round(hours * 60)} minutes`;
  if (hours === 1) return "1 hour";
  if (hours < 24) return `${hours} hours`;
  return `${Math.floor(hours / 24)} days ${hours % 24} hours`;
};

// Payment Helpers
export const calculatePaymentStatus = (totalAmount, paidAmount) => {
  if (!paidAmount) return PAYMENT_STATUS.PENDING;
  if (paidAmount >= totalAmount) return PAYMENT_STATUS.PAID;
  if (paidAmount > 0) return PAYMENT_STATUS.PARTIALLY_PAID;
  return PAYMENT_STATUS.PENDING;
};

// Format currency in INR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Calculate order progress percentage
export const calculateOrderProgress = (status) => {
  const progressSteps = {
    [ORDER_STATUSES.PENDING]: 0,
    [ORDER_STATUSES.APPROVED]: 20,
    [ORDER_STATUSES.READY_FOR_PRINTING]: 40,
    [ORDER_STATUSES.PRINTING_IN_PROGRESS]: 60,
    [ORDER_STATUSES.PRINT_READY]: 80,
    [ORDER_STATUSES.READY_FOR_DELIVERY]: 90,
    [ORDER_STATUSES.DELIVERED]: 100,
    [ORDER_STATUSES.REJECTED]: 100,
    [ORDER_STATUSES.REPLACEMENT_REQUESTED]: 50,
  };
  return progressSteps[status] || 0;
};

// Get payment status styling
export const getPaymentStatusStyle = (status) => {
  const styles = {
    [PAYMENT_STATUS.PENDING]: "bg-yellow-100 text-yellow-800 border-yellow-200",
    [PAYMENT_STATUS.PARTIALLY_PAID]:
      "bg-blue-100 text-blue-800 border-blue-200",
    [PAYMENT_STATUS.PAID]: "bg-green-100 text-green-800 border-green-200",
    [PAYMENT_STATUS.REFUNDED]: "bg-red-100 text-red-800 border-red-200",
  };
  return styles[status] || "bg-gray-100 text-gray-800 border-gray-200";

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (remainingHours === 0) return `${days} day${days > 1 ? "s" : ""}`;
  return `${days} day${days > 1 ? "s" : ""} ${remainingHours} hour${
    remainingHours > 1 ? "s" : ""
  }`;
};
