import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Upload,
  RefreshCw,
  Download,
  Settings,
  Search,
  Filter,
  Eye,
  FileText,
  Clock,
  Zap,
  AlertCircle,
  MapPin,
  Users,
  Target
} from "lucide-react";
import { BPCLImportPanel } from "./components/BPCLImportPanel";

import { FuelTheftAlertsPanel } from "./components/FuelTheftAlertsPanel";
import { BPCLTransactionsTable } from "./components/BPCLTransactionsTable";


const FuelManagement = () => {

  const [refreshing, setRefreshing] = useState(false);

  // KPI data
  const kpiData = {
    todayTransactions: {
      count: 1247,
      change: 12.5,
      trend: "up"
    },
    activeAlerts: {
      count: 23,
      critical: 5,
      high: 8,
      medium: 10
    },
    autoMappingSuccess: {
      percentage: 94.2,
      mapped: 1175,
      total: 1247
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <div className="space-y-6">


      {/* Main 2-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BPCL Import Panel - Left (50%) */}
        {/* <div className="lg:col-span-1">
          <BPCLImportPanel />
        </div> */}

        {/* Fuel Theft Alerts Panel - Right (50%) */}
        {/* <div className="lg:col-span-1">
          <FuelTheftAlertsPanel />
        </div> */}
      </div>

      {/* BPCL Transactions Table */}
      <div className="min-h-[500px]">
        <BPCLTransactionsTable />
      </div>
    </div>
  );
};

export default FuelManagement;
