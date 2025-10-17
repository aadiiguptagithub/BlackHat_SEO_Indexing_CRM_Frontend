import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TripStatsHeader } from "./components/TripStatsHeader";
import { TripCreationModal } from "./components/TripCreationModal";
import { TripsTable } from "./components/TripsTable";
import { Plus } from "lucide-react";
import { tripData } from "./data/tripData";

export function TripManagement() {
  const [trips, setTrips] = useState(tripData.trips);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateTrip = (newTripData) => {
    // Generate new trip ID
    const tripCount = trips.length + 1;
    const newTripId = `TRP-${(2400 + tripCount).toString()}`;
    
    // Create new trip object
    const newTrip = {
      id: newTripId,
      date: new Date(newTripData.startDate).toLocaleDateString("en-GB"),
      vehicle: newTripData.vehicle.id,
      vehicleNumber: newTripData.vehicle.number,
      driver: newTripData.driver.name,
      driverRating: newTripData.driver.rating,
      route: `${newTripData.route.from} → ${newTripData.route.to}`,
      from: newTripData.route.from,
      to: newTripData.route.to,
      distance: newTripData.distance,
      load: parseFloat(newTripData.loadWeight),
      fuelAllocated: newTripData.fuelAllocated,
      fuelUsed: null,
      variance: null,
      status: "pending",
      priority: newTripData.priority,
      startDate: newTripData.startDate,
      notes: newTripData.notes,
      createdAt: new Date()
    };

    // Add to trips list
    setTrips(prev => [newTrip, ...prev]);

    // Show success toast
    toast({
      title: "Trip Created Successfully",
      description: `Trip ${newTripId} has been created and assigned to ${newTripData.driver.name}`,
      variant: "success",
    });
  };

  // Calculate updated statistics based on current trips
  const calculateStats = () => {
    const activeTrips = trips.filter(trip => trip.status === "active").length;
    const completedToday = trips.filter(trip => {
      const today = new Date().toLocaleDateString("en-GB");
      return trip.date === today && trip.status === "completed";
    }).length;
    const pendingTrips = trips.filter(trip => trip.status === "pending").length;

    return {
      totalTrips: { value: trips.length.toLocaleString(), change: "+5.2%" },
      activeTrips: { value: activeTrips.toString(), change: "+12%" },
      completedToday: { value: completedToday.toString(), change: "+3 from yesterday" },
      pending: { value: pendingTrips.toString(), change: "-2 from yesterday" }
    };
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1920px] mx-auto">
        {/* Page Header with Create Button */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#013763] mb-2">Trip Management</h1>
            <p className="text-gray-600">Create, manage, and monitor your fleet trips</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#013763] hover:bg-[#001f3f] text-white flex items-center gap-2 px-6 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Create New Trip
          </Button>
        </div>

        {/* Trip Statistics Header */}
        {/* <TripStatsHeader statistics={calculateStats()} /> */}

        {/* Main Content - Full Width Trips Table */}
        <div className="mt-6">
          <TripsTable trips={trips} />
        </div>

        {/* Trip Creation Modal */}
        <TripCreationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTrip}
        />
      </div>
    </div>
  );
}
