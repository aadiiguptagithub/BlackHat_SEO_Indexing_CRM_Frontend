import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../../components/ui/table";
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Settings, 
  Calendar, 
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Fuel,
  Gauge,
  AlertTriangle,
  Activity,
  FileText,
  Eye,
  MoreHorizontal,
  Flag,
  Shield
} from "lucide-react";
import { ReportBuilderPanel } from "./ReportBuilderPanel";
import { MetricsCards } from "./MetricsCards";
import { InteractiveCharts } from "./InteractiveCharts";
import { ReportsTable } from "./ReportsTable";

export function Reports() {
  const [builderCollapsed, setBuilderCollapsed] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async (reportConfig) => {
    setLoading(true);
    try {
      // Simulate report generation
      setTimeout(() => {
        setSelectedReport(reportConfig);
        setReportData({
          metrics: {
            totalFuelConsumed: "24,856 L",
            averageEfficiency: "2.85 KM/L",
            varianceAlerts: "12 High Risk",
            fuelVarianceImpact: "516 L Over-consumed"
          },
          tableData: generateMockReportData(reportConfig.reportType)
        });
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error generating report:", error);
      setLoading(false);
    }
  };

  const generateMockReportData = (reportType) => {
    // Mock data based on report type
    const baseData = [
      {
        tripId: "TRP-2024-1156",
        date: "11-10-2024",
        vehicleNo: "MH-12-AB-1234",
        driverName: "Rajesh Kumar",
        route: "Mumbai → Pune",
        distanceKm: 148,
        loadWeightMt: 12.5,
        allocatedL: 52.0,
        actualL: 65.2,
        variancePercent: 25.4,
        riskLevel: "Critical"
      },
      {
        tripId: "TRP-2024-1157",
        date: "11-10-2024",
        vehicleNo: "GJ-05-CD-5678",
        driverName: "Amit Patel",
        route: "Ahmedabad → Surat",
        distanceKm: 263,
        loadWeightMt: 18.2,
        allocatedL: 92.1,
        actualL: 108.5,
        variancePercent: 17.8,
        riskLevel: "High"
      },
      {
        tripId: "TRP-2024-1158",
        date: "10-10-2024",
        vehicleNo: "KA-03-EF-9012",
        driverName: "Suresh Reddy",
        route: "Bangalore → Mysore",
        distanceKm: 156,
        loadWeightMt: 8.7,
        allocatedL: 54.6,
        actualL: 62.8,
        variancePercent: 15.0,
        riskLevel: "High"
      },
      {
        tripId: "TRP-2024-1159",
        date: "10-10-2024",
        vehicleNo: "TN-09-GH-3456",
        driverName: "Murugan S",
        route: "Chennai → Coimbatore",
        distanceKm: 507,
        loadWeightMt: 22.1,
        allocatedL: 177.5,
        actualL: 195.2,
        variancePercent: 10.0,
        riskLevel: "Medium"
      },
      {
        tripId: "TRP-2024-1160",
        date: "09-10-2024",
        vehicleNo: "RJ-14-IJ-7890",
        driverName: "Vikram Singh",
        route: "Jaipur → Delhi",
        distanceKm: 280,
        loadWeightMt: 15.3,
        allocatedL: 98.0,
        actualL: 103.5,
        variancePercent: 5.6,
        riskLevel: "Low"
      }
    ];

    return baseData;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between h-16">
        <div>
          <h1 className="text-2xl font-bold text-[#013763]">Analytics & Reports</h1>
          <div className="text-sm text-gray-500 mt-1">
            Dashboard &gt; Analytics &amp; Reports
          </div>
        </div>
        {/* <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Dashboard
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div> */}
      </div>

      {/* Report Builder Panel */}
      <Card className={`transition-all duration-300 ${builderCollapsed ? 'h-16' : 'h-auto'}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#013763]">
              Report Builder
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBuilderCollapsed(!builderCollapsed)}
            >
              {builderCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        {!builderCollapsed && (
          <CardContent>
            <ReportBuilderPanel 
              onGenerateReport={handleGenerateReport}
              loading={loading}
            />
          </CardContent>
        )}
      </Card>

      {/* Main Content - Visual Dashboard */}
      {reportData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Metrics Cards */}
          <div>
            <MetricsCards metrics={reportData.metrics} />
          </div>
          
          {/* Right Column - Interactive Charts */}
          <div>
            <InteractiveCharts reportType={selectedReport?.reportType} />
          </div>
        </div>
      )}

      {/* Generated Reports Table */}
      {/* {reportData && (
        <ReportsTable 
          reportData={reportData.tableData}
          reportType={selectedReport?.reportType}
          reportName={selectedReport?.reportName}
        />
      )} */}

      {/* Empty State */}
      {!reportData && !loading && (
        <Card className="py-16">
          <CardContent className="text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Report Generated
            </h3>
            <p className="text-gray-500 mb-6">
              Use the Report Builder above to generate your first analytics report
            </p>
            <Button 
              onClick={() => setBuilderCollapsed(false)}
              className="bg-[#013763] text-white hover:bg-[#001f3f]"
            >
              Open Report Builder
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="py-16">
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#013763] mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Generating Report...
            </h3>
            <p className="text-gray-500">
              Please wait while we process your analytics data
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Reports;
