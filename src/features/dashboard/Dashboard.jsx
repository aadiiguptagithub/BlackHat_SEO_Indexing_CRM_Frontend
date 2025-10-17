"use client";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { DashboardHeader } from "./components/DashboardHeader";
import { StatsCards } from "./components/StatsCards";
import { OrdersTable } from "./components/OrdersTable";

import { SalesChart } from "./components/SalesChart";
import { dashboardData } from "./dashboard-data";
import {
  Truck,
  Car,
  Fuel,
  AlertTriangle,
  Gauge,
} from "lucide-react";

export function Dashboard() {
  // State for date range selection
  const [activeRange, setActiveRange] = useState("last7Days");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
  });



  // Handle date range change
  const handleRangeChange = (range) => {
    setActiveRange(range);
    const today = new Date();
    const newRange = { startDate: new Date(), endDate: new Date() };

    switch (range) {
      case "today":
        newRange.startDate = new Date();
        break;
      case "last7Days":
        newRange.startDate = new Date(today.setDate(today.getDate() - 7));
        break;
      case "last30Days":
        newRange.startDate = new Date(today.setDate(today.getDate() - 30));
        break;
      case "thisMonth":
        newRange.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "last12Months":
        newRange.startDate = new Date(
          today.getFullYear() - 1,
          today.getMonth(),
          today.getDate()
        );
        break;
      case "thisYear":
        newRange.startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        break;
    }

    setDateRange(newRange);
  };

  // Filter data based on date range only
  const filteredData = useMemo(() => {
    const filtered = dashboardData.orders.filter((order) => {
      // Date range filter
      if (order.date < dateRange.startDate || order.date > dateRange.endDate) {
        return false;
      }
      return true;
    });
    return filtered;
  }, [dateRange]);

  // Prepare logistics chart data
  const { lineData, pieData } = useMemo(() => {
    // 7-day fuel consumption trend
    const lineData = dashboardData.fuelConsumption.map(item => ({
      day: item.day,
      consumption: item.consumption,
      target: item.target,
    }));

    // Vehicle efficiency comparison for pie chart
    const pieData = dashboardData.vehicleEfficiency.map((item, index) => ({
      name: item.vehicle,
      value: item.efficiency,
      target: item.target,
      color: index === 0 ? "#013763" : index === 1 ? "#bd171f" : index === 2 ? "#6B7280" : index === 3 ? "#F59E0B" : "#10B981"
    }));

    return { lineData, pieData };
  }, []);

  // Calculate logistics KPI stats
  const stats = useMemo(
    () => [
      {
        title: "Today's Fuel",
        value: `${dashboardData.kpis.todaysFuel.value} ${dashboardData.kpis.todaysFuel.unit}`,
        icon: Fuel,
        change: dashboardData.kpis.todaysFuel.change,
      },
      {
        title: "Active Trips",
        value: dashboardData.kpis.activeTrips.value,
        icon: Truck,
        change: dashboardData.kpis.activeTrips.change,
      },
      {
        title: "Theft Alerts",
        value: `${dashboardData.kpis.theftAlerts.value} ${dashboardData.kpis.theftAlerts.unit}`,
        icon: AlertTriangle,
        change: dashboardData.kpis.theftAlerts.change,
      },
      {
        title: "Fleet Efficiency",
        value: `${dashboardData.kpis.fleetEfficiency.value} ${dashboardData.kpis.fleetEfficiency.unit}`,
        icon: Gauge,
        change: dashboardData.kpis.fleetEfficiency.change,
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1920px] mx-auto p-4 sm:p-6">
        {/* Dashboard Header with filters */}
        <DashboardHeader
          activeRange={activeRange}
          onRangeChange={handleRangeChange}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        {/* Stats Cards */}
        <div className="mt-6">
          <StatsCards stats={stats} />
        </div>

        {/* Charts Section */}
        <div className="mt-6">
          <SalesChart lineData={lineData} pieData={pieData} />
        </div>

        {/* Recent Activities Table */}
        <div className="mt-6">
          <OrdersTable orders={dashboardData.recentActivities} isLogistics={true} />
        </div>
      </div>
    </div>
  );
}
