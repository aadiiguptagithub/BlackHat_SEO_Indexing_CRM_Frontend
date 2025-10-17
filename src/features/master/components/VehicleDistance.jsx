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
  Download, 
  Upload, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin,
  Truck,
  Route,
  Navigation,
  AlertTriangle,
  Info,
  Calculator,
  MoreHorizontal
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";

const VehicleDistance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [distanceFilter, setDistanceFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // Mock route distance data
  const routeDistances = [
    {
      id: "RD001",
      vehicleNo: "MH-12-AB-1234",
      routeName: "Mumbai–Pune",
      from: "Mumbai",
      to: "Pune",
      distance: 148,
      averageBreakup: "Highway: 120km, City: 28km",
      lastUpdated: "2024-10-01",
      status: "verified"
    },
    {
      id: "RD002",
      vehicleNo: "GJ-05-CD-5678",
      routeName: "Ahmedabad–Surat",
      from: "Ahmedabad",
      to: "Surat",
      distance: 263,
      averageBreakup: "Highway: 240km, City: 23km",
      lastUpdated: "2024-09-28",
      status: "verified"
    },
    {
      id: "RD003",
      vehicleNo: "KA-03-EF-9012",
      routeName: "Bangalore–Mysore",
      from: "Bangalore",
      to: "Mysore",
      distance: 156,
      averageBreakup: "Highway: 130km, City: 26km",
      lastUpdated: "2024-10-05",
      status: "verified"
    },
    {
      id: "RD004",
      vehicleNo: "TN-09-GH-3456",
      routeName: "Chennai–Coimbatore",
      from: "Chennai",
      to: "Coimbatore",
      distance: 0,
      averageBreakup: "Not calculated",
      lastUpdated: "Never",
      status: "missing"
    },
    {
      id: "RD005",
      vehicleNo: "RJ-14-IJ-7890",
      routeName: "Jaipur–Delhi",
      from: "Jaipur",
      to: "Delhi",
      distance: 280,
      averageBreakup: "Highway: 260km, City: 20km",
      lastUpdated: "2024-09-30",
      status: "verified"
    },
    {
      id: "RD006",
      vehicleNo: "UP-16-KL-2345",
      routeName: "Noida–Sahibabad",
      from: "Noida",
      to: "Sahibabad",
      distance: 25,
      averageBreakup: "City: 25km",
      lastUpdated: "2024-10-02",
      status: "verified"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "verified": return "text-green-600 bg-green-50 border-green-200";
      case "missing": return "text-red-600 bg-red-50 border-red-200";
      case "pending": return "text-orange-600 bg-orange-50 border-orange-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusBadge = (status) => {
    const colors = getStatusColor(status);
    const icons = {
      verified: null,
      missing: <AlertTriangle className="h-3 w-3 mr-1" />,
      pending: <Info className="h-3 w-3 mr-1" />
    };
    
    return (
      <Badge className={`text-xs border ${colors}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleRowSelect = (routeId) => {
    setSelectedRows(prev => 
      prev.includes(routeId) 
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    );
  };

  const filteredRoutes = routeDistances.filter(route => {
    const matchesSearch = 
      route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.to.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDistance = true;
    if (distanceFilter === "short") matchesDistance = route.distance > 0 && route.distance <= 100;
    else if (distanceFilter === "medium") matchesDistance = route.distance > 100 && route.distance <= 300;
    else if (distanceFilter === "long") matchesDistance = route.distance > 300;
    else if (distanceFilter === "missing") matchesDistance = route.distance === 0;
    
    return matchesSearch && matchesDistance;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#013763]">Vehicle Distance Master</h1>
          <p className="text-gray-600 mt-1">Define and manage standard trip distances for routes</p>
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
                Add Route Distance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Route Distance</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vehicle Number</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MH-12-AB-1234">MH-12-AB-1234</SelectItem>
                        <SelectItem value="GJ-05-CD-5678">GJ-05-CD-5678</SelectItem>
                        <SelectItem value="KA-03-EF-9012">KA-03-EF-9012</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Route Name</label>
                    <Input placeholder="e.g., Mumbai–Pune" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From Location</label>
                    <Input placeholder="Starting point" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To Location</label>
                    <Input placeholder="Destination" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Distance (KM)</label>
                    <div className="flex space-x-2">
                      <Input type="number" placeholder="0" />
                      <Button type="button" variant="outline" size="sm">
                        <Calculator className="h-4 w-4 mr-2" />
                        Auto Calculate
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Average Breakup</label>
                    <Input placeholder="e.g., Highway: 120km, City: 28km" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#013763] text-white hover:bg-[#001f3f]">
                  Save Route
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
                placeholder="Search by Route Name or Vehicle No..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Distances</SelectItem>
                  <SelectItem value="short">Short (&lt;100 km)</SelectItem>
                  <SelectItem value="medium">Medium (100-300 km)</SelectItem>
                  <SelectItem value="long">Long (&gt;300 km)</SelectItem>
                  <SelectItem value="missing">Missing Distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      {/* <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">How Distance Master Works</span>
          </div>
          <div className="text-sm text-blue-800">
            These predefined distances are used to auto-fill trip forms when creating new trips. 
            Routes without distances are highlighted in red and should be updated for accurate trip planning.
          </div>
        </CardContent>
      </Card> */}

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedRows.length} route(s) selected
              </span>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-[#013763] text-white hover:bg-[#001f3f]">
                  <Calculator className="h-4 w-4 mr-2" />
                  Bulk Calculate Distance
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Distance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#013763] flex items-center">
            <Route className="h-5 w-5 mr-2" />
            Route Distances ({filteredRoutes.length} routes)
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
                          setSelectedRows(filteredRoutes.map(r => r.id));
                        } else {
                          setSelectedRows([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="font-medium">ID</TableHead>
                  <TableHead className="font-medium">Vehicle No.</TableHead>
                  <TableHead className="font-medium">Route Name</TableHead>
                  <TableHead className="font-medium">From</TableHead>
                  <TableHead className="font-medium">To</TableHead>
                  <TableHead className="font-medium">Distance (KM)</TableHead>
                  <TableHead className="font-medium">Average Breakup</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoutes.map((route) => (
                  <TableRow 
                    key={route.id} 
                    className={`hover:bg-gray-50 ${
                      route.status === 'missing' ? 'bg-red-50 border-l-4 border-red-400' : ''
                    }`}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedRows.includes(route.id)}
                        onChange={() => handleRowSelect(route.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {route.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-2 text-gray-400" />
                        {route.vehicleNo}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Route className="h-4 w-4 mr-2 text-gray-400" />
                        {route.routeName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-green-600" />
                        {route.from}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Navigation className="h-4 w-4 mr-2 text-red-600" />
                        {route.to}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {route.distance > 0 ? (
                        <span className="text-[#013763]">{route.distance} km</span>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span>Missing</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm text-gray-600 cursor-help">
                              {route.averageBreakup.length > 20 
                                ? `${route.averageBreakup.substring(0, 20)}...` 
                                : route.averageBreakup}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{route.averageBreakup}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(route.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit distance inline</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
              <span>Total: {filteredRoutes.length} routes</span>
              <span className="text-green-600">
                Verified: {filteredRoutes.filter(r => r.status === 'verified').length}
              </span>
              <span className="text-red-600">
                Missing Distance: {filteredRoutes.filter(r => r.status === 'missing').length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-blue-600" />
              <span>Used to auto-fill trip forms</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleDistance;