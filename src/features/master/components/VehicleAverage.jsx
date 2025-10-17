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
  Save, 
  X, 
  TrendingUp,
  Truck,
  History,
  Info,
  CheckCircle,
  Clock
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";

const VehicleAverage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock vehicle mileage data
  const [vehicleMileage, setVehicleMileage] = useState([
    {
      id: "VEH001",
      vehicleNo: "MH-12-AB-1234",
      company: "RRC Logistics",
      weightCategories: {
        "0-5": { mileage: 8.5, lastUpdated: "2024-10-01" },
        "5.1-20": { mileage: 6.2, lastUpdated: "2024-10-01" },
        "20+": { mileage: 4.8, lastUpdated: "2024-10-01" }
      }
    },
    {
      id: "VEH002",
      vehicleNo: "GJ-05-CD-5678",
      company: "RRC Logistics",
      weightCategories: {
        "0-5": { mileage: 9.1, lastUpdated: "2024-09-28" },
        "5.1-20": { mileage: 6.8, lastUpdated: "2024-09-28" },
        "20+": { mileage: 5.2, lastUpdated: "2024-09-28" }
      }
    },
    {
      id: "VEH003",
      vehicleNo: "KA-03-EF-9012",
      company: "RRC Logistics",
      weightCategories: {
        "0-5": { mileage: 7.9, lastUpdated: "2024-10-05" },
        "5.1-20": { mileage: 5.8, lastUpdated: "2024-10-05" },
        "20+": { mileage: 4.3, lastUpdated: "2024-10-05" }
      }
    },
    {
      id: "VEH004",
      vehicleNo: "TN-09-GH-3456",
      company: "RRC Logistics",
      weightCategories: {
        "0-5": { mileage: 8.7, lastUpdated: "2024-10-03" },
        "5.1-20": { mileage: 6.5, lastUpdated: "2024-10-03" },
        "20+": { mileage: 4.9, lastUpdated: "2024-10-03" }
      }
    },
    {
      id: "VEH005",
      vehicleNo: "RJ-14-IJ-7890",
      company: "RRC Logistics",
      weightCategories: {
        "0-5": { mileage: 8.2, lastUpdated: "2024-09-30" },
        "5.1-20": { mileage: 6.0, lastUpdated: "2024-09-30" },
        "20+": { mileage: 4.5, lastUpdated: "2024-09-30" }
      }
    }
  ]);

  const handleEditClick = (vehicleId, category) => {
    const vehicle = vehicleMileage.find(v => v.id === vehicleId);
    setEditingCell(`${vehicleId}-${category}`);
    setEditValue(vehicle.weightCategories[category].mileage.toString());
  };

  const handleSave = (vehicleId, category) => {
    const newMileage = parseFloat(editValue);
    if (newMileage >= 0.1 && newMileage <= 10) {
      setVehicleMileage(prev => prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? {
              ...vehicle,
              weightCategories: {
                ...vehicle.weightCategories,
                [category]: {
                  mileage: newMileage,
                  lastUpdated: new Date().toISOString().split('T')[0]
                }
              }
            }
          : vehicle
      ));
    }
    setEditingCell(null);
    setEditValue("");
  };

  const handleCancel = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const filteredVehicles = vehicleMileage.filter(vehicle => {
    const matchesSearch = vehicle.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = companyFilter === "all" || vehicle.company === companyFilter;
    return matchesSearch && matchesCompany;
  });

  const renderMileageCell = (vehicle, category) => {
    const isEditing = editingCell === `${vehicle.id}-${category}`;
    const mileageData = vehicle.weightCategories[category];
    
    if (isEditing) {
      return (
        <div className="flex items-center space-x-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-20 h-8"
            type="number"
            min="0.1"
            max="10"
            step="0.1"
          />
          <Button
            size="sm"
            onClick={() => handleSave(vehicle.id, category)}
            className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700"
          >
            <Save className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            onClick={handleCancel}
            variant="outline"
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between group">
        <div>
          <span className="font-medium">{mileageData.mileage} KM/L</span>
          <div className="text-xs text-gray-500">{mileageData.lastUpdated}</div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleEditClick(vehicle.id, category)}
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
        >
          <Edit className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#013763]">Vehicle Mileage Configuration</h1>
          <p className="text-gray-600 mt-1">Configure per-vehicle mileage based on load categories</p>
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
                Add Vehicle Average
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Vehicle Mileage Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vehicle Number</label>
                    <Input placeholder="e.g., MH-12-AB-1234" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company</label>
                    <Select defaultValue="RRC Logistics">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RRC Logistics">RRC Logistics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Mileage by Weight Category</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">0-5 MT (KM/L)</label>
                      <Input type="number" min="0.1" max="10" step="0.1" placeholder="8.5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">5.1-20 MT (KM/L)</label>
                      <Input type="number" min="0.1" max="10" step="0.1" placeholder="6.2" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">&gt;20 MT (KM/L)</label>
                      <Input type="number" min="0.1" max="10" step="0.1" placeholder="4.8" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#013763] text-white hover:bg-[#001f3f]">
                  Save Configuration
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
                placeholder="Search by Vehicle Number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  <SelectItem value="RRC Logistics">RRC Logistics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weight Categories Info */}
      {/* <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Weight Categories Explained</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <strong>0-5 MT:</strong> Light loads, better fuel efficiency
            </div>
            <div>
              <strong>5.1-20 MT:</strong> Medium loads, moderate efficiency
            </div>
            <div>
              <strong>&gt;20 MT:</strong> Heavy loads, lower efficiency
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Configuration Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#013763] flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Mileage Configuration ({filteredVehicles.length} vehicles)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium">Vehicle No.</TableHead>
                  <TableHead className="font-medium">Company</TableHead>
                  <TableHead className="font-medium text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center justify-center">
                          0-5 MT (KM/L)
                          <Info className="h-3 w-3 ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Light loads: 0 to 5 metric tons</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="font-medium text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center justify-center">
                          5.1-20 MT (KM/L)
                          <Info className="h-3 w-3 ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Medium loads: 5.1 to 20 metric tons</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="font-medium text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center justify-center">
                          &gt;20 MT (KM/L)
                          <Info className="h-3 w-3 ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Heavy loads: Over 20 metric tons</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-2 text-gray-400" />
                        {vehicle.vehicleNo}
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.company}</TableCell>
                    <TableCell className="text-center">
                      {renderMileageCell(vehicle, "0-5")}
                    </TableCell>
                    <TableCell className="text-center">
                      {renderMileageCell(vehicle, "5.1-20")}
                    </TableCell>
                    <TableCell className="text-center">
                      {renderMileageCell(vehicle, "20+")}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <History className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View revision history</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
              <span>Total: {filteredVehicles.length} vehicles configured</span>
              <span>Valid range: 0.1 - 10.0 KM/L</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Click any mileage value to edit inline</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleAverage;