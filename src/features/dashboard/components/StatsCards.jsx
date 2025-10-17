import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatsCards({ stats, className }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
        className
      )}
    >
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="bg-white hover:shadow-lg transition-shadow duration-200 border border-gray-200"
        >
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "p-3 rounded-xl bg-gray-50"
                )}
              >
                <stat.icon className={cn("w-6 h-6 text-[#013763]")} />
              </div>
              <h3 className="text-sm font-medium text-gray-500">
                {stat.title}
              </h3>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#013763]">
                {stat.value}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
