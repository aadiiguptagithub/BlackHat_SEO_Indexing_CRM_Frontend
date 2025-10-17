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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../../components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  AlertTriangle,
  User,
  Phone,
  CreditCard,
  Calendar,
  Truck,
  MoreHorizontal
} from "lucide-react";

const DriverMaster = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock driver data
  const drivers = [
    {
      id: "DRV001",
      name: "Rajesh Kumar",
      mobile: "+91 9876543210",
      licenseNo: "MH1420110012345",
      licenseExpiry: "2024-11-15",
      status: "expiring-soon",
      assignedVehicle: "MH-12-AB-1234",
      joinDate: "2022-01-15"
    },
    {
      id: "DRV002",
      name: "Amit Patel",
      mobile: "+91 9876543211",
      licenseNo: "GJ0520110054321",
      licenseExpiry: "2025-03-20",
      status: "active",
      assignedVehicle: "GJ-05-CD-5678",
      joinDate: "2021-06-10"
    },
    {
      id: "DRV003",
      name: "Suresh Reddy",
      mobile: "+91 9876543212",
      licenseNo: "KA0320110098765",
      licenseExpiry: "2024-10-20",
      status: "expiring-soon",
      assignedVehicle: "KA-03-EF-9012",
      joinDate: "2023-03-22"
    },
    {
      id: "DRV004",
      name: "Murugan S",
      mobile: "+91 9876543213",
      licenseNo: "TN0920110013579",
      licenseExpiry: "2025-08-12",
      status: "active",
      assignedVehicle: "TN-09-GH-3456",
      joinDate: "2022-11-05"
    },
    {
      id: "DRV005",
      name: "Vikram Singh",
      mobile: "+91 9876543214",
      licenseNo: "RJ1420110024681",
      licenseExpiry: "2023-12-01",
      status: "inactive",
      assignedVehicle: null,
      joinDate: "2020-08-18"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-50 border-green-200";
      case "inactive": return "text-gray-600 bg-gray-50 border-gray-200";
      case "expiring-soon": return "text-orange-600 bg-orange-50 border-orange-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusBadge = (status) => {
    const colors = getStatusColor(status);
    const icons = {
      active: null,
      inactive: null,
      "expiring-soon": <AlertTriangle className="h-3 w-3 mr-1" />
    };
    
    return (
      <Badge className={`text-xs border ${colors}`}>
        {icons[status]}
        {status === "expiring-soon" ? "Expiring Soon" : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const isLicenseExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const handleRowSelect = (driverId) => {
    setSelectedRows(prev => 
      prev.includes(driverId) 
        ? prev.filter(id => id !== driverId)
        : [...prev, driverId]
    );
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.mobile.includes(searchTerm) ||
      driver.licenseNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || driver.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#013763]">Driver Master</h1>
          <p className="text-gray-600 mt-1">Manage driver profiles and license information</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-[#013763] text-[#013763] hover:bg-[#013763] hover:text-white">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" className="border-gray-300">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="bg-[#013763] text-white hover:bg-[#001f3f]">
                <Plus className="h-4 w-4 mr-2" />
                Add New Driver
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input placeholder="Enter driver name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input placeholder="+91 XXXXXXXXXX" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">License Number</label>
                  <Input placeholder="License number" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">License Expiry</label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assigned Vehicle</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No vehicle assigned</SelectItem>
                      <SelectItem value="MH-12-AB-1234">MH-12-AB-1234</SelectItem>
                      <SelectItem value="GJ-05-CD-5678">GJ-05-CD-5678</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select defaultValue="active">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#013763] text-white hover:bg-[#001f3f]">
                  Save Driver
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by Name, Mobile, or License No..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                </SelectContent>
              </Select>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drivers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#013763] flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Drivers ({filteredDrivers.length})
            </div>
            {selectedRows.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{selectedRows.length} selected</span>
                <Button size="sm" variant="outline">
                  Bulk Actions
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(filteredDrivers.map(d => d.id));
                        } else {
                          setSelectedRows([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="font-medium">Driver ID</TableHead>
                  <TableHead className="font-medium">Name</TableHead>
                  <TableHead className="font-medium">Mobile Number</TableHead>
                  <TableHead className="font-medium">License Number</TableHead>
                  <TableHead className="font-medium">License Expiry</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Assigned Vehicle</TableHead>
                  <TableHead className="font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.slice(0, itemsPerPage).map((driver) => (
                  <TableRow 
                    key={driver.id} 
                    className={`hover:bg-gray-50 ${
                      isLicenseExpiringSoon(driver.licenseExpiry) ? 'bg-orange-50 border-l-4 border-orange-400' : ''
                    }`}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedRows.includes(driver.id)}
                        onChange={() => handleRowSelect(driver.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {driver.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        {driver.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {driver.mobile}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                        {driver.licenseNo}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span className={isLicenseExpiringSoon(driver.licenseExpiry) ? 'text-orange-600 font-medium' : ''}>
                          {driver.licenseExpiry}
                        </span>
                        {isLicenseExpiringSoon(driver.licenseExpiry) && (
                          <AlertTriangle className="h-4 w-4 ml-2 text-orange-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(driver.status)}
                    </TableCell>
                    <TableCell>
                      {driver.assignedVehicle ? (
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-2 text-gray-400" />
                          {driver.assignedVehicle}
                        </div>
                      ) : (
                        <span className="text-gray-400">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit Driver">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Delete Driver">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Table Footer */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <div className="flex space-x-6">
              <span>Total: {filteredDrivers.length} drivers</span>
              <span className="text-green-600">
                Active: {filteredDrivers.filter(d => d.status === 'active').length}
              </span>
              <span className="text-orange-600">
                Expiring Soon: {filteredDrivers.filter(d => d.status === 'expiring-soon').length}
              </span>
              <span className="text-gray-600">
                Inactive: {filteredDrivers.filter(d => d.status === 'inactive').length}
              </span>
            </div>
            <div>
              Showing {Math.min(itemsPerPage, filteredDrivers.length)} of {filteredDrivers.length} drivers
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { DriverMaster };
