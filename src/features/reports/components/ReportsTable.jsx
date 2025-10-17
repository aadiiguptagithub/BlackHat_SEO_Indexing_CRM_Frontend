import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { 
  Search, 
  Download, 
  Eye, 
  MoreHorizontal, 
  Flag, 
  Shield,
  FileText,
  ArrowUpDown,
  Filter,
  Settings
} from "lucide-react";

export const ReportsTable = ({ reportData, reportType, reportName }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [activeTab, setActiveTab] = useState("current");
  const itemsPerPage = 25;

  // Mock data for other tabs
  const savedReports = [
    { id: 1, name: "Monthly Fuel Analysis", type: "vehicle-fuel-analysis", lastRun: "10-10-2024", status: "Ready" },
    { id: 2, name: "High Variance Alert", type: "fuel-variance", lastRun: "09-10-2024", status: "Scheduled" },
    { id: 3, name: "Driver Performance Q3", type: "driver-performance", lastRun: "08-10-2024", status: "Ready" }
  ];

  const scheduledReports = [
    { id: 1, name: "Daily Fuel Summary", frequency: "Daily", nextRun: "12-10-2024 06:00", status: "Active" },
    { id: 2, name: "Weekly Variance Report", frequency: "Weekly", nextRun: "14-10-2024 08:00", status: "Active" },
    { id: 3, name: "Monthly Executive Summary", frequency: "Monthly", nextRun: "01-11-2024 09:00", status: "Paused" }
  ];

  const reportHistory = [
    { id: 1, name: "Fuel Variance Report", generatedBy: "Admin", generatedAt: "11-10-2024 10:30", records: 156 },
    { id: 2, name: "Vehicle Efficiency Analysis", generatedBy: "Manager", generatedAt: "10-10-2024 14:15", records: 89 },
    { id: 3, name: "Trip Summary Report", generatedBy: "Operator", generatedAt: "09-10-2024 16:45", records: 234 }
  ];

  const getVarianceColor = (variance) => {
    const num = parseFloat(variance);
    if (num < 5) return "text-green-600 bg-green-50";
    if (num < 10) return "text-blue-600 bg-blue-50";  
    if (num < 15) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getRiskBadgeColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'normal': return "text-green-600 bg-green-50";
      case 'low': return "text-blue-600 bg-blue-50";
      case 'medium': return "text-yellow-600 bg-yellow-50";
      case 'high': return "text-orange-600 bg-orange-50";
      case 'critical': return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...reportData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [reportData, sortConfig]);

  const filteredData = sortedData.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#013763]">
            Generated Reports
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Columns
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="current">
              Current Report ({reportName || 'None'})
            </TabsTrigger>
            <TabsTrigger value="saved">
              Saved Reports ({savedReports.length})
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              Scheduled Reports ({scheduledReports.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              Report History ({reportHistory.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-6">
            {reportData && reportData.length > 0 ? (
              <>
                {/* Search and Controls */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-80">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search across all columns..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {filteredData.length} records
                    </span>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>

                {/* Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-32">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleSort('tripId')}
                              className="h-8 p-0 hover:bg-transparent"
                            >
                              Trip ID
                              <ArrowUpDown className="ml-2 h-3 w-3" />
                            </Button>
                          </TableHead>
                          <TableHead className="w-28">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleSort('date')}
                              className="h-8 p-0 hover:bg-transparent"
                            >
                              Date
                              <ArrowUpDown className="ml-2 h-3 w-3" />
                            </Button>
                          </TableHead>
                          <TableHead className="w-32">Vehicle No</TableHead>
                          <TableHead className="w-36">Driver Name</TableHead>
                          <TableHead className="w-44">Route</TableHead>
                          <TableHead className="w-24 text-right">Distance KM</TableHead>
                          <TableHead className="w-24 text-right">Load Weight MT</TableHead>
                          <TableHead className="w-24 text-right">Allocated L</TableHead>
                          <TableHead className="w-24 text-right">Actual L</TableHead>
                          <TableHead className="w-24 text-right">Variance %</TableHead>
                          <TableHead className="w-28">Risk Level</TableHead>
                          <TableHead className="w-20">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData.map((row, index) => (
                          <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell>
                              <Button 
                                variant="link" 
                                className="p-0 h-auto font-mono text-[#013763] hover:underline"
                              >
                                {row.tripId}
                              </Button>
                            </TableCell>
                            <TableCell className="text-sm">
                              {row.date}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="link" 
                                className="p-0 h-auto font-medium text-[#013763] hover:underline"
                              >
                                {row.vehicleNo}
                              </Button>
                            </TableCell>
                            <TableCell className="text-sm">
                              {row.driverName}
                            </TableCell>
                            <TableCell className="text-sm" title={row.route}>
                              {row.route.length > 20 ? `${row.route.substring(0, 20)}...` : row.route}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {row.distanceKm}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {row.loadWeightMt} MT
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {row.allocatedL.toFixed(1)}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {row.actualL.toFixed(1)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge className={`text-xs font-medium ${getVarianceColor(row.variancePercent)}`}>
                                {row.variancePercent.toFixed(1)}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`text-xs ${getRiskBadgeColor(row.riskLevel)}`}>
                                {row.riskLevel}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Trip Details
                                  </DropdownMenuItem>
                                  {(row.riskLevel === 'High' || row.riskLevel === 'Critical') && (
                                    <DropdownMenuItem>
                                      <Shield className="h-4 w-4 mr-2" />
                                      Investigate
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem>
                                    <Flag className="h-4 w-4 mr-2" />
                                    Add to Watchlist
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Generate Individual Report
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Report Data
                </h3>
                <p className="text-gray-500">
                  Generate a report using the Report Builder to see data here
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <div className="space-y-4">
              {savedReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <p className="text-sm text-gray-500">Type: {report.type} • Last run: {report.lastRun}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{report.status}</Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="mt-6">
            <div className="space-y-4">
              {scheduledReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <p className="text-sm text-gray-500">Frequency: {report.frequency} • Next run: {report.nextRun}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={report.status === 'Active' ? 'default' : 'secondary'}>
                      {report.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <div className="space-y-4">
              {reportHistory.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <p className="text-sm text-gray-500">
                      Generated by {report.generatedBy} on {report.generatedAt} • {report.records} records
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
