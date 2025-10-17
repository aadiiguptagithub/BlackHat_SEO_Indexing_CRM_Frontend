import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../../components/ui/table";
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  MapPin, 
  Eye, 
  Edit,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  MoreHorizontal
} from "lucide-react";

const BPCLTransactionsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  // Mock transaction data
  const transactions = [
    {
      id: "TXN001247",
      dateTime: "2024-10-11 09:45:32",
      vehicle: "MH-12-AB-1234",
      fuelCard: "BPCL-5678",
      station: "BPCL Pune East",
      location: "Pune, Maharashtra",
      fuelType: "Diesel",
      quantity: "85.5 L",
      rate: "₹89.50",
      amount: "₹7,652",
      mappedTrip: "TRP-2024-1156",
      variance: "+2.5%",
      status: "mapped",
      alertGenerated: "No",
      confidence: 95
    },
    {
      id: "TXN001246",
      dateTime: "2024-10-11 09:44:15",
      vehicle: "GJ-05-CD-5678",
      fuelCard: "BPCL-9012",
      station: "BPCL Ahmedabad",
      location: "Ahmedabad, Gujarat",
      fuelType: "Diesel",
      quantity: "92.3 L",
      rate: "₹88.75",
      amount: "₹8,192",
      mappedTrip: "Unmapped",
      variance: "N/A",
      status: "unmapped",
      alertGenerated: "No",
      confidence: 0
    },
    {
      id: "TXN001245",
      dateTime: "2024-10-11 09:43:58",
      vehicle: "KA-03-EF-9012",
      fuelCard: "BPCL-3456",
      station: "BPCL Bangalore",
      location: "Bangalore, Karnataka",
      fuelType: "Diesel",
      quantity: "78.9 L",
      rate: "₹90.25",
      amount: "₹7,121",
      mappedTrip: "TRP-2024-1157",
      variance: "+18.7%",
      status: "alert",
      alertGenerated: "High Risk",
      confidence: 87
    },
    {
      id: "TXN001244",
      dateTime: "2024-10-11 09:42:41",
      vehicle: "TN-09-GH-3456",
      fuelCard: "BPCL-7890",
      station: "BPCL Chennai",
      location: "Chennai, Tamil Nadu",
      fuelType: "Petrol",
      quantity: "65.2 L",
      rate: "₹102.30",
      amount: "₹6,670",
      mappedTrip: "TRP-2024-1158",
      variance: "-1.2%",
      status: "mapped",
      alertGenerated: "No",
      confidence: 92
    },
    {
      id: "TXN001243",
      dateTime: "2024-10-11 09:41:29",
      vehicle: "RJ-14-IJ-7890",
      fuelCard: "BPCL-2345",
      station: "BPCL Jaipur",
      location: "Jaipur, Rajasthan",
      fuelType: "Diesel",
      quantity: "88.1 L",
      rate: "₹87.80",
      amount: "₹7,735",
      mappedTrip: "Processing",
      variance: "N/A",
      status: "processing",
      alertGenerated: "No",
      confidence: 0
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "mapped": return "text-green-600 bg-green-50";
      case "unmapped": return "text-orange-600 bg-orange-50";
      case "alert": return "text-red-600 bg-red-50";
      case "processing": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getAlertColor = (alert) => {
    switch (alert) {
      case "Critical": return "text-red-600 bg-red-50";
      case "High Risk": return "text-orange-600 bg-orange-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "No": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const handleBulkMap = () => {
    console.log("Bulk mapping selected transactions:", selectedRows);
  };

  const handleRowSelect = (transactionId) => {
    setSelectedRows(prev => 
      prev.includes(transactionId) 
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#013763] flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {/* BPCL Transactions Management */}
            BPCL Fuel Management

          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {filteredTransactions.length} transactions
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by vehicle, station, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
            <span className="text-sm text-blue-700">
              {selectedRows.length} transaction(s) selected
            </span>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                onClick={handleBulkMap}
                className="bg-[#013763] text-white hover:bg-[#001f3f]"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Bulk Map Trips
              </Button>
              <Button variant="outline" size="sm">
                Mark as Reviewed
              </Button>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(filteredTransactions.map(t => t.id));
                        } else {
                          setSelectedRows([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="text-xs font-medium">Transaction ID</TableHead>
                  <TableHead className="text-xs font-medium">Date/Time</TableHead>
                  <TableHead className="text-xs font-medium">Vehicle</TableHead>
                  <TableHead className="text-xs font-medium">Fuel Card</TableHead>
                  <TableHead className="text-xs font-medium">Station</TableHead>
                  <TableHead className="text-xs font-medium">Location</TableHead>
                  <TableHead className="text-xs font-medium">Fuel Type</TableHead>
                  <TableHead className="text-xs font-medium">Quantity</TableHead>
                  <TableHead className="text-xs font-medium">Rate</TableHead>
                  <TableHead className="text-xs font-medium">Amount</TableHead>
                  <TableHead className="text-xs font-medium">Mapped Trip</TableHead>
                  <TableHead className="text-xs font-medium">Variance</TableHead>
                  <TableHead className="text-xs font-medium">Status</TableHead>
                  <TableHead className="text-xs font-medium">Alert</TableHead>
                  <TableHead className="text-xs font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-gray-50">
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedRows.includes(transaction.id)}
                        onChange={() => handleRowSelect(transaction.id)}
                      />
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {transaction.id}
                    </TableCell>
                    <TableCell className="text-xs">
                      {transaction.dateTime}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {transaction.vehicle}
                    </TableCell>
                    <TableCell className="text-xs">
                      {transaction.fuelCard}
                    </TableCell>
                    <TableCell className="text-xs">
                      {transaction.station}
                    </TableCell>
                    <TableCell className="text-xs">
                      {transaction.location}
                    </TableCell>
                    <TableCell className="text-xs">
                      {transaction.fuelType}
                    </TableCell>
                    <TableCell className="text-xs">
                      {transaction.quantity}
                    </TableCell>
                    <TableCell className="text-xs">
                      {transaction.rate}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-[#013763]">
                      {transaction.amount}
                    </TableCell>
                    <TableCell className="text-xs">
                      {transaction.mappedTrip}
                    </TableCell>
                    <TableCell className="text-xs">
                      {transaction.variance}
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getAlertColor(transaction.alertGenerated)}`}>
                        {transaction.alertGenerated}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Table Footer with Statistics */}
        <div className="flex justify-between items-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
          <div className="flex space-x-6">
            <span>Total: {filteredTransactions.length} transactions</span>
            {/* <span className="text-green-600">
              Mapped: {filteredTransactions.filter(t => t.status === 'mapped').length}
            </span>
            <span className="text-orange-600">
              Unmapped: {filteredTransactions.filter(t => t.status === 'unmapped').length}
            </span>
            <span className="text-red-600">
              Alerts: {filteredTransactions.filter(t => t.status === 'alert').length}
            </span> */}
          </div>
          <div>
            Auto-mapping success: 94.2%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { BPCLTransactionsTable };
