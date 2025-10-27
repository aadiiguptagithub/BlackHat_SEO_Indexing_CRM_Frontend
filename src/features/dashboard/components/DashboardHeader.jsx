"use client";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRangeModal } from "./DateRangeModal";

const dateRanges = [
  { id: "today", label: "Today" },
  { id: "last7Days", label: "Last 7 Days" },
  { id: "last30Days", label: "Last 30 Days" },
  { id: "thisMonth", label: "This Month" },
  { id: "last12Months", label: "Last 12 Months" },
  { id: "thisYear", label: "This Year" },
];

export function DashboardHeader({
  activeRange,
  onRangeChange,
  dateRange,
  onDateRangeChange,
}) {
  const [dateModalOpen, setDateModalOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      {/* Dashboard Title */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-[#013763]">
          Black Hat SEO Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Welcome back! Monitor your SEO campaigns and submissions.
          </div>
        </div>
      </div>

      {/* Filters Row - now with no wrapping and no scroll */}
      <div className="flex items-center space-x-2">
        {/* Date Range Quick Select */}
        <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
          {dateRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => onRangeChange(range.id)}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-all duration-200 whitespace-nowrap",
                activeRange === range.id
                  ? "bg-[#013763] text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Custom Date Range */}
        <button
          onClick={() => setDateModalOpen(true)}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-gray-50 shadow-sm transition-colors duration-200 whitespace-nowrap"
        >
          <CalendarIcon className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">
            {format(dateRange.startDate, "MMM d")} -{" "}
            {format(dateRange.endDate, "MMM d, yyyy")}
          </span>
        </button>


      </div>

      {/* Modals */}

      <DateRangeModal
        open={dateModalOpen}
        onOpenChange={setDateModalOpen}
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
      />
    </div>
  );
}
