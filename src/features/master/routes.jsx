import { Routes, Route } from "react-router-dom";
import { DriverMaster } from "./components/DriverMaster";
import VehicleAverage from "./components/VehicleAverage";
import VehicleDistance from "./components/VehicleDistance";

/**
 * Master routes configuration
 * Handles all master data routing for RRC Logistics CRM
 */
export function MasterRoutes() {
  return (
    <Routes>
      {/* Driver Master page */}
      <Route path="driver" element={<DriverMaster />} />
      {/* Vehicle Average page */}
      <Route path="vehicle-average" element={<VehicleAverage />} />
      {/* Vehicle Distance page */}
      <Route path="vehicle-distance" element={<VehicleDistance />} />
      {/* Default redirect to driver */}
      <Route index element={<DriverMaster />} />
    </Routes>
  );
}

export default MasterRoutes;
