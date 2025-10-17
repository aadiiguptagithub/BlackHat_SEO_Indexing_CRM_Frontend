import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarDays, Fuel, Star, Truck, X } from "lucide-react";
import { tripData, calculateFuel } from "../data/tripData";

export function TripCreationModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    vehicleId: "",
    routeId: "",
    loadWeight: "",
    driverId: "",
    startDate: "",
    priority: "medium",
    notes: ""
  });

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [calculatedFuel, setCalculatedFuel] = useState(0);

  // Filter available vehicles and drivers
  const availableVehicles = tripData.vehicles.filter(v => v.status === "available");
  const availableDrivers = tripData.drivers.filter(d => d.status === "available");

  // Update calculated fuel when dependencies change
  useEffect(() => {
    if (selectedRoute && selectedVehicle && formData.loadWeight) {
      const fuel = calculateFuel(
        selectedRoute.distance,
        selectedVehicle.mileage,
        parseFloat(formData.loadWeight),
        selectedVehicle.capacity
      );
      setCalculatedFuel(fuel);
    } else {
      setCalculatedFuel(0);
    }
  }, [selectedRoute, selectedVehicle, formData.loadWeight]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVehicleChange = (vehicleId) => {
    const vehicle = tripData.vehicles.find(v => v.id === vehicleId);
    setSelectedVehicle(vehicle);
    handleInputChange("vehicleId", vehicleId);
  };

  const handleRouteChange = (routeId) => {
    const route = tripData.routes.find(r => r.id === routeId);
    setSelectedRoute(route);
    handleInputChange("routeId", routeId);
  };

  const handleDriverChange = (driverId) => {
    const driver = tripData.drivers.find(d => d.id === driverId);
    setSelectedDriver(driver);
    handleInputChange("driverId", driverId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const tripData = {
      ...formData,
      vehicle: selectedVehicle,
      route: selectedRoute,
      driver: selectedDriver,
      fuelAllocated: calculatedFuel,
      distance: selectedRoute?.distance || 0
    };

    onSubmit(tripData);
    
    // Reset form
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      vehicleId: "",
      routeId: "",
      loadWeight: "",
      driverId: "",
      startDate: "",
      priority: "medium",
      notes: ""
    });
    setSelectedVehicle(null);
    setSelectedRoute(null);
    setSelectedDriver(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isFormValid = formData.vehicleId && formData.routeId && formData.loadWeight && 
                     formData.driverId && formData.startDate;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#013763] flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Create New Trip
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create a new trip for your fleet
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Step 1: Vehicle Selection */}
          <div className="space-y-2">
            <Label htmlFor="vehicle" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Vehicle Selection
            </Label>
            <Select value={formData.vehicleId} onValueChange={handleVehicleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a vehicle..." />
              </SelectTrigger>
              <SelectContent>
                {availableVehicles.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{vehicle.number}</span>
                      <div className="flex gap-2 ml-4">
                        <Badge variant="outline">{vehicle.type}</Badge>
                        <Badge variant="outline">{vehicle.capacity} MT</Badge>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedVehicle && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Type: {selectedVehicle.type}</span>
                  <span>Capacity: {selectedVehicle.capacity} MT</span>
                  <span>Mileage: {selectedVehicle.mileage} KM/L</span>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Route Selection */}
          <div className="space-y-2">
            <Label htmlFor="route">Route Selection</Label>
            <Select value={formData.routeId} onValueChange={handleRouteChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a route..." />
              </SelectTrigger>
              <SelectContent>
                {tripData.routes.map(route => (
                  <SelectItem key={route.id} value={route.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{route.from} → {route.to}</span>
                      <div className="flex gap-2 ml-4">
                        <Badge variant="outline">{route.distance} KM</Badge>
                        <Badge variant="outline">{route.estimatedTime}</Badge>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRoute && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Distance: {selectedRoute.distance} KM</span>
                  <span>Est. Time: {selectedRoute.estimatedTime}</span>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Load Weight */}
          <div className="space-y-2">
            <Label htmlFor="loadWeight">Load Weight (0-{selectedVehicle?.capacity || 50} MT)</Label>
            <Input
              id="loadWeight"
              type="number"
              min="0"
              max={selectedVehicle?.capacity || 50}
              step="0.1"
              value={formData.loadWeight}
              onChange={(e) => handleInputChange("loadWeight", e.target.value)}
              placeholder="Enter load weight in MT"
            />
          </div>

          {/* Step 4: Driver Assignment */}
          <div className="space-y-2">
            <Label htmlFor="driver">Driver Assignment</Label>
            <Select value={formData.driverId} onValueChange={handleDriverChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a driver..." />
              </SelectTrigger>
              <SelectContent>
                {availableDrivers.map(driver => (
                  <SelectItem key={driver.id} value={driver.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{driver.name}</span>
                      <div className="flex items-center gap-2 ml-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{driver.rating}</span>
                        </div>
                        <Badge variant="outline">{driver.experience}Y exp</Badge>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDriver && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Phone: {selectedDriver.phone}</span>
                  <span>Experience: {selectedDriver.experience} years</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{selectedDriver.rating}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 5: Fuel Calculation */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Fuel className="w-4 h-4" />
              Fuel Calculation (Auto-calculated)
            </Label>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">Allocated Fuel:</span>
                <span className="text-lg font-bold text-blue-900">{calculatedFuel} L</span>
              </div>
              {selectedRoute && selectedVehicle && formData.loadWeight && (
                <div className="mt-2 text-xs text-blue-700">
                  Formula: {selectedRoute.distance} km ÷ ({selectedVehicle.mileage} km/l × weight factor)
                </div>
              )}
            </div>
          </div>

          {/* Step 6: Additional Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Start Date & Time
                </Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional instructions or notes..."
                rows={3}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid}
              className="flex-1 bg-[#013763] hover:bg-[#001f3f] text-white"
            >
              Create Trip
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
