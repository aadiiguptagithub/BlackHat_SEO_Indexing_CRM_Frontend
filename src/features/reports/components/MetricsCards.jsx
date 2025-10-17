import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { 
  Fuel, 
  Gauge, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Activity
} from "lucide-react";

export const MetricsCards = ({ metrics }) => {
  const metricsConfig = [
    {
      title: "Total Fuel Consumed",
      value: metrics.totalFuelConsumed,
      trend: "+5.2%",
      trendUp: true,
      icon: Fuel,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "vs previous period"
    },
    {
      title: "Average Fleet Efficiency",
      value: metrics.averageEfficiency,
      trend: "+2.1%",
      trendUp: true,
      icon: Gauge,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      description: "vs fleet target"
    },
    {
      title: "Variance Alerts",
      value: metrics.varianceAlerts,
      breakdown: "5 Critical, 4 High, 3 Medium",
      icon: AlertTriangle,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      description: "Active alerts"
    },
    {
      title: "Fuel Variance Impact",
      value: metrics.fuelVarianceImpact,
      trend: "+12.8%",
      trendUp: false,
      icon: Activity,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      description: "Over allocation"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {metricsConfig.map((metric, index) => (
        <Card key={index} className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
              </div>
              {metric.trend && (
                <div className={`flex items-center text-sm ${
                  metric.trendUp ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trendUp ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {metric.trend}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">
                {metric.title}
              </h3>
              <div className="text-2xl font-bold text-[#013763]">
                {metric.value}
              </div>
              {metric.breakdown && (
                <div className="flex flex-wrap gap-1">
                  <Badge variant="destructive" className="text-xs">5 Critical</Badge>
                  <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">4 High</Badge>
                  <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">3 Medium</Badge>
                </div>
              )}
              <p className="text-xs text-gray-500">
                {metric.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
