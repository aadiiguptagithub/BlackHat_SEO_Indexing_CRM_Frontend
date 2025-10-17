import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Truck, TruckIcon, CheckCircle, Clock } from "lucide-react";

const statsConfig = [
  {
    key: "totalTrips",
    title: "Total Trips", 
    icon: Truck,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    key: "activeTrips",
    title: "Active Trips",
    icon: TruckIcon, 
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    key: "completedToday",
    title: "Completed Today",
    icon: CheckCircle,
    color: "text-purple-600", 
    bgColor: "bg-purple-50"
  },
  {
    key: "pending",
    title: "Pending",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50"
  }
];

export function TripStatsHeader({ statistics, className }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", className)}>
      {statsConfig.map((config) => {
        const stat = statistics[config.key];
        const IconComponent = config.icon;
        
        return (
          <Card
            key={config.key}
            className="bg-white hover:shadow-lg transition-shadow duration-200 border border-gray-200"
          >
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-xl", config.bgColor)}>
                  <IconComponent className={cn("w-6 h-6", config.color)} />
                </div>
                <h3 className="text-sm font-medium text-gray-500">
                  {config.title}
                </h3>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-semibold text-[#013763]">
                  {stat.value}
                </p>
                <span className="text-xs text-gray-500">
                  {stat.change}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
