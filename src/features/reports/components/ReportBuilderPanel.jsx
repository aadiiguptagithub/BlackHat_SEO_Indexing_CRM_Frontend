import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { Calendar } from "../../../components/ui/calendar";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import { 
  Calendar as CalendarIcon, 
  Filter, 
  Play, 
  Loader2,
  ChevronDown,
  X
} from "lucide-react";
import { format } from "date-fns";

const REPORT_TYPES = {
  "fuel-consumption": {
    category: "📊 Fuel Consumption Reports",
    reports: [
      { value: "daily-fuel-summary", label: "Daily Fuel Summary", description: "Date-wise consumption across fleet" },
      { value: "vehicle-fuel-analysis", label: "Vehicle Fuel Analysis", description: "Individual vehicle efficiency patterns" },
      { value: "driver-performance", label: "Driver Performance Report", description: "Driver-wise fuel metrics" },
      { value: "route-fuel-analysis", label: "Route Fuel Analysis", description: "Route-specific consumption patterns" }
    ]
  },
  "variance-theft": {
    category: "📊 Variance & Theft Reports",
    reports: [
      { value: "fuel-variance", label: "Fuel Variance Report", description: "Allocated vs Actual analysis" },
      { value: "theft-detection", label: "Theft Detection Report", description: "Suspicious consumption patterns" },
      { value: "high-variance-trips", label: "High Variance Trips", description: "Trips with >15% variance" },
      { value: "investigation-report", label: "Investigation Report", description: "Detailed flagged transaction analysis" }
    ]
  },
  "operational": {
    category: "📊 Operational Reports",
    reports: [
      { value: "trip-summary", label: "Trip Summary Report", description: "Complete trip details with fuel data" },
      { value: "vehicle-utilization", label: "Vehicle Utilization", description: "Usage patterns and efficiency" },
      { value: "bpcl-transactions", label: "BPCL Transaction Report", description: "Complete purchase history" },
      { value: "station-analysis", label: "Station Analysis", description: "Fuel station usage and rate comparison" }
    ]
  },
  "management": {
    category: "📊 Management Dashboard",
    reports: [
      { value: "executive-summary", label: "Executive Summary", description: "High-level KPIs for management" },
      { value: "cost-analysis", label: "Cost Analysis", description: "Fuel cost trends (NO financial amounts)" },
      { value: "fleet-performance", label: "Fleet Performance", description: "Overall efficiency and utilization" },
      { value: "monthly-compliance", label: "Monthly Compliance", description: "Regulatory reporting" }
    ]
  }
};

const DATE_PRESETS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last-7-days" },
  { label: "Last 30 Days", value: "last-30-days" },
  { label: "This Month", value: "this-month" },
  { label: "Last Month", value: "last-month" },
  { label: "Custom Range", value: "custom" }
];

const MOCK_VEHICLES = [
  "MH-12-AB-1234", "GJ-05-CD-5678", "KA-03-EF-9012", 
  "TN-09-GH-3456", "RJ-14-IJ-7890", "UP-16-KL-2345"
];

const MOCK_DRIVERS = [
  "Rajesh Kumar", "Amit Patel", "Suresh Reddy", 
  "Murugan S", "Vikram Singh", "Pradeep Sharma"
];

const MOCK_ROUTES = [
  "Mumbai → Pune", "Ahmedabad → Surat", "Bangalore → Mysore",
  "Chennai → Coimbatore", "Jaipur → Delhi", "Noida → Lucknow"
];

export const ReportBuilderPanel = ({ onGenerateReport, loading }) => {
  const [selectedReportType, setSelectedReportType] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("last-7-days");
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [additionalFilters, setAdditionalFilters] = useState({});
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const getReportLabel = (reportType) => {
    for (const category of Object.values(REPORT_TYPES)) {
      const report = category.reports.find(r => r.value === reportType);
      if (report) return report.label;
    }
    return "";
  };

  const handleGenerateReport = () => {
    if (!selectedReportType) return;

    const reportConfig = {
      reportType: selectedReportType,
      reportName: getReportLabel(selectedReportType),
      dateRange: selectedDateRange,
      filters: {
        vehicles: selectedVehicles,
        drivers: selectedDrivers,
        routes: selectedRoutes,
        ...additionalFilters
      }
    };

    onGenerateReport(reportConfig);
  };

  const addFilter = (type, value) => {
    if (type === 'vehicles' && !selectedVehicles.includes(value)) {
      setSelectedVehicles([...selectedVehicles, value]);
    } else if (type === 'drivers' && !selectedDrivers.includes(value)) {
      setSelectedDrivers([...selectedDrivers, value]);
    } else if (type === 'routes' && !selectedRoutes.includes(value)) {
      setSelectedRoutes([...selectedRoutes, value]);
    }
  };

  const removeFilter = (type, value) => {
    if (type === 'vehicles') {
      setSelectedVehicles(selectedVehicles.filter(v => v !== value));
    } else if (type === 'drivers') {
      setSelectedDrivers(selectedDrivers.filter(d => d !== value));
    } else if (type === 'routes') {
      setSelectedRoutes(selectedRoutes.filter(r => r !== value));
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Configuration Form */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        {/* Report Type Selector */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Type
          </label>
          <Select value={selectedReportType} onValueChange={setSelectedReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type..." />
            </SelectTrigger>
            <SelectContent className="max-h-96">
              {Object.entries(REPORT_TYPES).map(([categoryKey, category]) => (
                <div key={categoryKey}>
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                    {category.category}
                  </div>
                  {category.reports.map((report) => (
                    <SelectItem key={report.value} value={report.value}>
                      <div>
                        <div className="font-medium">{report.label}</div>
                        <div className="text-xs text-gray-500">{report.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATE_PRESETS.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter Button */}
        <div>
          <Button variant="outline" className="w-full">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Generate Button */}
        <div>
          <Button 
            onClick={handleGenerateReport}
            disabled={!selectedReportType || loading}
            className="w-full bg-[#1e40af] text-white hover:bg-[#1e3a8a]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Dynamic Filters Section */}
      <Card className="bg-gray-50 border-dashed">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Vehicle Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Filter
              </label>
              <Select onValueChange={(value) => addFilter('vehicles', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicles..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  {MOCK_VEHICLES.map((vehicle) => (
                    <SelectItem key={vehicle} value={vehicle}>
                      {vehicle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedVehicles.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedVehicles.map((vehicle) => (
                    <Badge key={vehicle} variant="secondary" className="text-xs">
                      {vehicle}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => removeFilter('vehicles', vehicle)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Driver Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Driver Filter
              </label>
              <Select onValueChange={(value) => addFilter('drivers', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select drivers..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drivers</SelectItem>
                  {MOCK_DRIVERS.map((driver) => (
                    <SelectItem key={driver} value={driver}>
                      {driver}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDrivers.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedDrivers.map((driver) => (
                    <Badge key={driver} variant="secondary" className="text-xs">
                      {driver}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => removeFilter('drivers', driver)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Route Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Route Filter
              </label>
              <Select onValueChange={(value) => addFilter('routes', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select routes..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Routes</SelectItem>
                  {MOCK_ROUTES.map((route) => (
                    <SelectItem key={route} value={route}>
                      {route}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedRoutes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedRoutes.map((route) => (
                    <Badge key={route} variant="secondary" className="text-xs">
                      {route}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => removeFilter('routes', route)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Filters based on report type */}
          {(selectedReportType === 'bpcl-transactions' || selectedReportType === 'station-analysis') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Station
                  </label>
                  <Select onValueChange={(value) => setAdditionalFilters({...additionalFilters, station: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select station..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stations</SelectItem>
                      <SelectItem value="bpcl-pune">BPCL Pune East</SelectItem>
                      <SelectItem value="bpcl-mumbai">BPCL Mumbai</SelectItem>
                      <SelectItem value="bpcl-ahmedabad">BPCL Ahmedabad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {(selectedReportType === 'fuel-variance' || selectedReportType === 'theft-detection') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variance Threshold
                  </label>
                  <Select onValueChange={(value) => setAdditionalFilters({...additionalFilters, threshold: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select threshold..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Above 5%</SelectItem>
                      <SelectItem value="10">Above 10%</SelectItem>
                      <SelectItem value="15">Above 15%</SelectItem>
                      <SelectItem value="20">Above 20%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
