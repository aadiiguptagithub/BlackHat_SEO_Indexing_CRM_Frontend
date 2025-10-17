import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function SalesChart({ lineData, pieData }) {
  // Fallback for empty data
  const displayLineData =
    lineData?.length > 0 ? lineData : [{ month: "No data", orders: 0 }];

  const displayPieData =
    pieData?.length > 0
      ? pieData
      : [{ name: "No data", value: 100, color: "#cccccc" }];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Orders Trend Chart */}
      <Card className="lg:col-span-3 bg-white p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#013763]">
            7-Day Fuel Consumption
          </h3>
          <p className="text-sm text-gray-500">Daily fuel usage vs target</p>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayLineData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="consumption"
                stroke="#013763"
                strokeWidth={2}
                name="Consumption (L)"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#bd171f"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Target (L)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Payment Split Pie Chart */}
      <Card className="bg-white p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#013763]">
            Vehicle Efficiency
          </h3>
          <p className="text-sm text-gray-500">KM/L by vehicle</p>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayPieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
              >
                {displayPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
