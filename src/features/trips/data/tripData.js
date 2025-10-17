    export const tripData = {
  // Trip Statistics
  statistics: {
    totalTrips: { value: "1,247", change: "+5.2%" },
    activeTrips: { value: "23", change: "+12%" },
    completedToday: { value: "12", change: "+3 from yesterday" },
    pending: { value: "5", change: "-2 from yesterday" }
  },

  // Vehicles data
  vehicles: [
    { id: "TRK-001", number: "GJ-01-AB-1234", type: "Heavy Truck", capacity: 50, mileage: 3.2, status: "available" },
    { id: "TRK-002", number: "GJ-01-AB-5678", type: "Medium Truck", capacity: 25, mileage: 4.1, status: "available" },
    { id: "TRK-003", number: "GJ-01-AB-9012", type: "Light Truck", capacity: 10, mileage: 5.5, status: "on-trip" },
    { id: "TRK-004", number: "GJ-01-AB-3456", type: "Heavy Truck", capacity: 50, mileage: 2.8, status: "available" },
    { id: "TRK-005", number: "GJ-01-AB-7890", type: "Medium Truck", capacity: 25, mileage: 3.9, status: "maintenance" },
  ],

  // Routes data
  routes: [
    { id: "RT-001", from: "Mumbai", to: "Delhi", distance: 1400, estimatedTime: "18 hours" },
    { id: "RT-002", from: "Mumbai", to: "Bangalore", distance: 980, estimatedTime: "12 hours" },
    { id: "RT-003", from: "Delhi", to: "Kolkata", distance: 1450, estimatedTime: "20 hours" },
    { id: "RT-004", from: "Chennai", to: "Hyderabad", distance: 630, estimatedTime: "8 hours" },
    { id: "RT-005", from: "Pune", to: "Ahmedabad", distance: 650, estimatedTime: "9 hours" },
  ],

  // Drivers data
  drivers: [
    { id: "DRV-001", name: "Rajesh Kumar", phone: "+91 9876543210", rating: 4.8, experience: 8, status: "available" },
    { id: "DRV-002", name: "Suresh Patel", phone: "+91 9876543211", rating: 4.6, experience: 12, status: "on-trip" },
    { id: "DRV-003", name: "Amit Singh", phone: "+91 9876543212", rating: 4.9, experience: 5, status: "available" },
    { id: "DRV-004", name: "Vikram Sharma", phone: "+91 9876543213", rating: 4.3, experience: 15, status: "available" },
    { id: "DRV-005", name: "Manoj Gupta", phone: "+91 9876543214", rating: 4.7, experience: 10, status: "on-leave" },
  ],

  // Sample trips data
  trips: [
    {
      id: "TRP-2401",
      date: "11-10-2025",
      vehicle: "TRK-001",
      vehicleNumber: "GJ-01-AB-1234",
      driver: "Rajesh Kumar",
      driverRating: 4.8,
      route: "Mumbai → Delhi",
      from: "Mumbai",
      to: "Delhi",
      distance: 1400,
      load: 45.5,
      fuelAllocated: 450,
      fuelUsed: 465,
      variance: 3.3,
      status: "completed",
      priority: "high",
      startDate: "2025-10-11T06:00:00",
      createdAt: new Date(2025, 9, 11, 8, 30)
    },
    {
      id: "TRP-2402",
      date: "11-10-2025",
      vehicle: "TRK-003",
      vehicleNumber: "GJ-01-AB-9012",
      driver: "Amit Singh",
      driverRating: 4.9,
      route: "Mumbai → Bangalore",
      from: "Mumbai", 
      to: "Bangalore",
      distance: 980,
      load: 8.2,
      fuelAllocated: 180,
      fuelUsed: 175,
      variance: -2.8,
      status: "active",
      priority: "medium",
      startDate: "2025-10-11T14:00:00",
      createdAt: new Date(2025, 9, 11, 12, 15)
    },
    {
      id: "TRP-2403",
      date: "10-10-2025",
      vehicle: "TRK-002",
      vehicleNumber: "GJ-01-AB-5678",
      driver: "Suresh Patel",
      driverRating: 4.6,
      route: "Delhi → Kolkata",
      from: "Delhi",
      to: "Kolkata", 
      distance: 1450,
      load: 22.8,
      fuelAllocated: 380,
      fuelUsed: 425,
      variance: 11.8,
      status: "completed",
      priority: "low",
      startDate: "2025-10-10T05:30:00",
      createdAt: new Date(2025, 9, 10, 7, 45)
    },
    {
      id: "TRP-2404",
      date: "10-10-2025",
      vehicle: "TRK-004",
      vehicleNumber: "GJ-01-AB-3456",
      driver: "Vikram Sharma",
      driverRating: 4.3,
      route: "Chennai → Hyderabad",
      from: "Chennai",
      to: "Hyderabad",
      distance: 630,
      load: 38.5,
      fuelAllocated: 220,
      fuelUsed: 245,
      variance: 11.4,
      status: "completed",
      priority: "high",
      startDate: "2025-10-10T09:00:00",
      createdAt: new Date(2025, 9, 10, 11, 20)
    },
    {
      id: "TRP-2405",
      date: "09-10-2025",
      vehicle: "TRK-001",
      vehicleNumber: "GJ-01-AB-1234",
      driver: "Rajesh Kumar",
      driverRating: 4.8,
      route: "Pune → Ahmedabad",
      from: "Pune",
      to: "Ahmedabad",
      distance: 650,
      load: 42.0,
      fuelAllocated: 210,
      fuelUsed: 255,
      variance: 21.4,
      status: "completed",
      priority: "medium",
      startDate: "2025-10-09T07:15:00",
      createdAt: new Date(2025, 9, 9, 9, 30)
    },
    {
      id: "TRP-2406",
      date: "12-10-2025",
      vehicle: "TRK-002",
      vehicleNumber: "GJ-01-AB-5678",
      driver: "Suresh Patel",
      driverRating: 4.6,
      route: "Mumbai → Delhi",
      from: "Mumbai",
      to: "Delhi",
      distance: 1400,
      load: 18.5,
      fuelAllocated: 350,
      fuelUsed: null,
      variance: null,
      status: "pending",
      priority: "high",
      startDate: "2025-10-12T06:00:00",
      createdAt: new Date(2025, 9, 11, 16, 45)
    },
    {
      id: "TRP-2407",
      date: "12-10-2025", 
      vehicle: "TRK-004",
      vehicleNumber: "GJ-01-AB-3456",
      driver: "Vikram Sharma",
      driverRating: 4.3,
      route: "Bangalore → Chennai",
      from: "Bangalore",
      to: "Chennai",
      distance: 350,
      load: 35.2,
      fuelAllocated: 125,
      fuelUsed: null,
      variance: null,
      status: "pending",
      priority: "low",
      startDate: "2025-10-12T10:30:00",
      createdAt: new Date(2025, 9, 11, 18, 15)
    }
  ]
};

// Utility functions
export const getVarianceColor = (variance) => {
  if (variance === null || variance === undefined) return "text-gray-500";
  if (Math.abs(variance) < 5) return "text-green-600";
  if (Math.abs(variance) < 15) return "text-amber-600";
  return "text-red-600";
};

export const getVarianceBadgeColor = (variance) => {
  if (variance === null || variance === undefined) return "bg-gray-100 text-gray-800";
  if (Math.abs(variance) < 5) return "bg-green-100 text-green-800";
  if (Math.abs(variance) < 15) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
};

export const getStatusColor = (status) => {
  const colors = {
    active: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800", 
    pending: "bg-amber-100 text-amber-800",
    cancelled: "bg-red-100 text-red-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export const getPriorityColor = (priority) => {
  const colors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-amber-100 text-amber-800",
    low: "bg-green-100 text-green-800"
  };
  return colors[priority] || "bg-gray-100 text-gray-800";
};

// Fuel calculation logic: Distance ÷ (Base Mileage × Weight Factor)
export const calculateFuel = (distance, baseMileage, loadWeight, maxCapacity = 50) => {
  const weightFactor = 1 - (loadWeight / maxCapacity * 0.3); // 30% efficiency loss at max capacity
  const adjustedMileage = baseMileage * weightFactor;
  return Math.ceil(distance / adjustedMileage);
};
