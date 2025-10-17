import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Search, 
  FileText, 
  Eye, 
  UserCheck, 
  Camera, 
  MapPin, 
  Phone,
  CheckCircle,
  Clock,
  PlayCircle,
  PauseCircle
} from "lucide-react";

const FuelTheftAlertsPanel = () => {
  const [activeTab, setActiveTab] = useState("critical");

  // Alert data by priority
  const alertData = {
    critical: [
      {
        id: "ALT-C-001",
        time: "09:42:15",
        vehicle: "MH-12-AB-1234",
        variance: "25.5%",
        amount: "₹3,200",
        location: "Mumbai-Pune Highway"
      },
      {
        id: "ALT-C-002",
        time: "09:38:42",
        vehicle: "GJ-05-CD-5678",
        variance: "22.1%",
        amount: "₹2,850",
        location: "Ahmedabad Ring Road"
      }
    ],
    high: [
      {
        id: "ALT-H-003",
        time: "09:35:28",
        vehicle: "KA-03-EF-9012",
        variance: "18.7%",
        amount: "₹2,450",
        location: "Bangalore Outer Ring"
      },
      {
        id: "ALT-H-004",
        time: "09:32:11",
        vehicle: "TN-09-GH-3456",
        variance: "16.2%",
        amount: "₹1,950",
        location: "Chennai-Coimbatore"
      }
    ],
    medium: [
      {
        id: "ALT-M-005",
        time: "09:28:45",
        vehicle: "RJ-14-IJ-7890",
        variance: "12.4%",
        amount: "₹2,750",
        location: "Jaipur-Delhi Highway"
      },
      {
        id: "ALT-M-006",
        time: "09:25:33",
        vehicle: "UP-16-KL-2345",
        variance: "11.8%",
        amount: "₹2,100",
        location: "Noida Expressway"
      }
    ]
  };

  // Investigation workflow stages
  const workflowStages = [
    { name: "Alert Generated", status: "completed", count: 23 },
    { name: "Initial Review", status: "in-progress", count: 18 },
    { name: "Field Investigation", status: "pending", count: 12 },
    { name: "Resolution", status: "pending", count: 0 }
  ];

  // Investigation tools
  const investigationTools = [
    { name: "GPS Tracking", icon: MapPin, action: "View Route" },
    { name: "Driver Contact", icon: Phone, action: "Call Driver" },
    { name: "Photo Evidence", icon: Camera, action: "Request Photos" },
    { name: "Trip History", icon: FileText, action: "View History" },
    { name: "Fuel Records", icon: Search, action: "Check Records" },
    { name: "Assign Investigator", icon: UserCheck, action: "Assign" }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getWorkflowStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress": return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case "pending": return <Clock className="h-4 w-4 text-gray-400" />;
      default: return <PauseCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getAlertCount = (priority) => {
    return alertData[priority]?.length || 0;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#bd171f] flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Fuel Theft Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alert Priority Dashboard */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Alert Priority Dashboard</h4>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="critical" className="text-xs">
                Critical ({getAlertCount("critical")})
              </TabsTrigger>
              <TabsTrigger value="high" className="text-xs">
                High ({getAlertCount("high")})
              </TabsTrigger>
              <TabsTrigger value="medium" className="text-xs">
                Medium ({getAlertCount("medium")})
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs">
                All (23)
              </TabsTrigger>
            </TabsList>
            
            {["critical", "high", "medium"].map((priority) => (
              <TabsContent key={priority} value={priority} className="mt-4">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {alertData[priority]?.map((alert) => (
                    <div key={alert.id} className={`border rounded-lg p-3 ${getPriorityColor(priority)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono">{alert.id}</span>
                        <Badge variant="destructive" className="text-xs">
                          {alert.variance} variance
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Vehicle:</span>
                          <div className="font-medium">{alert.vehicle}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Time:</span>
                          <div className="font-medium">{alert.time}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <div className="font-medium">{alert.amount}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <div className="font-medium truncate">{alert.location}</div>
                        </div>
                      </div>
                      <div className="flex space-x-1 mt-2">
                        <Button variant="outline" size="sm" className="text-xs h-6">
                          <Eye className="h-3 w-3 mr-1" />
                          Investigate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
            
            <TabsContent value="all" className="mt-4">
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">All alerts across priorities</p>
                <p className="text-xs">Total: 23 active alerts</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Investigation Workflow Tracker */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Investigation Workflow</h4>
          <div className="space-y-3">
            {workflowStages.map((stage, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getWorkflowStatusIcon(stage.status)}
                  <span className="text-sm">{stage.name}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {stage.count}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Investigation Tools */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Investigation Tools</h4>
          <div className="grid grid-cols-2 gap-2">
            {investigationTools.map((tool, index) => (
              <Button 
                key={index}
                variant="outline" 
                size="sm" 
                className="h-8 text-xs justify-start"
              >
                <tool.icon className="h-3 w-3 mr-2" />
                {tool.action}
              </Button>
            ))}
          </div>
        </div>

        {/* Alert Summary */}
        <div className="bg-gradient-to-r from-[#bd171f] to-[#a01419] rounded-lg p-4 text-white">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold">23</div>
              <div className="text-xs opacity-80">Active Alerts</div>
            </div>
            <div>
              <div className="text-xl font-bold">89%</div>
              <div className="text-xs opacity-80">Resolution Rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { FuelTheftAlertsPanel };
