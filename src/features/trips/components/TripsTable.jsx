import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Search,
  Copy,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import { getVarianceColor, getVarianceBadgeColor, getStatusColor, getPriorityColor } from "../data/tripData";

export function TripsTable({ trips, className }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  // Filter trips based on search term
  const filteredTrips = trips.filter(trip => 
    trip.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort trips
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'date') {
      aValue = new Date(a.createdAt);
      bValue = new Date(b.createdAt);
    }
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getActionButtons = (trip) => {
    const baseActions = [
      { icon: Eye, label: "View Details", action: () => console.log("View", trip.id) },
      { icon: Edit, label: "Edit Trip", action: () => console.log("Edit", trip.id) },
      { icon: Copy, label: "Copy Trip ID", action: () => copyToClipboard(trip.id) },
    ];

    if (trip.status === "pending") {
      baseActions.push({ icon: Trash2, label: "Cancel Trip", action: () => console.log("Cancel", trip.id) });
    }

    return baseActions;
  };

  return (
    <Card className={`${className}`}>
      <div className="p-6 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#013763]">All Trips</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[120px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("id")}
                  className="h-auto p-0 font-medium"
                >
                  Trip ID
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("date")}
                  className="h-auto p-0 font-medium"
                >
                  Date
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-[110px]">Vehicle</TableHead>
              <TableHead className="w-[140px]">Driver</TableHead>
              <TableHead className="w-[180px]">Route</TableHead>
              <TableHead className="w-[80px] text-right">Distance</TableHead>
              <TableHead className="w-[80px] text-right">Load</TableHead>
              <TableHead className="w-[100px] text-right">Fuel Allocated</TableHead>
              <TableHead className="w-[100px] text-right">Fuel Used</TableHead>
              <TableHead className="w-[100px] text-right">Variance %</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTrips.map((trip) => (
              <TableRow key={trip.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span 
                      className="cursor-pointer hover:text-[#013763]"
                      onClick={() => copyToClipboard(trip.id)}
                      title="Click to copy"
                    >
                      {trip.id}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell>{trip.date}</TableCell>
                
                <TableCell>
                  <div className="cursor-pointer hover:text-[#013763]" title={trip.vehicleNumber}>
                    {trip.vehicle}
                  </div>
                </TableCell>
                
                <TableCell>
                  <span>{trip.driver}</span>
                </TableCell>
                
                <TableCell>
                  <div className="truncate" title={trip.route}>
                    {trip.route}
                  </div>
                </TableCell>
                
                <TableCell className="text-right">{trip.distance} KM</TableCell>
                
                <TableCell className="text-right">{trip.load} MT</TableCell>
                
                <TableCell className="text-right">{trip.fuelAllocated} L</TableCell>
                
                <TableCell className="text-right">
                  {trip.fuelUsed ? (
                    <span className={trip.fuelUsed > trip.fuelAllocated ? "text-red-600 font-medium" : ""}>
                      {trip.fuelUsed} L
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                
                <TableCell className="text-right">
                  {trip.variance !== null && trip.variance !== undefined ? (
                    <Badge className={getVarianceBadgeColor(trip.variance)}>
                      {trip.variance > 0 ? "+" : ""}{trip.variance.toFixed(1)}%
                    </Badge>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge className={getStatusColor(trip.status)}>
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </Badge>
                    <Badge className={getPriorityColor(trip.priority)} variant="outline">
                      {trip.priority.charAt(0).toUpperCase() + trip.priority.slice(1)}
                    </Badge>
                  </div>
                </TableCell>
                
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {getActionButtons(trip).map((action, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={action.action}
                          className="flex items-center gap-2"
                        >
                          <action.icon className="h-4 w-4" />
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {sortedTrips.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          {searchTerm ? "No trips found matching your search." : "No trips available."}
        </div>
      )}
      
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing {sortedTrips.length} of {trips.length} trips</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 rounded-full"></div>
              <span>&lt; 5% variance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-100 rounded-full"></div>
              <span>5-15% variance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-100 rounded-full"></div>
              <span>&gt; 15% variance</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
