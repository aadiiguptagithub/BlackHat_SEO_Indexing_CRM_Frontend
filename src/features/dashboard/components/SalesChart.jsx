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

export function SalesChart({ lineData, pieData, activeRange = 'last7Days' }) {
  // Fallback for empty data
  const displayLineData =
    lineData?.length > 0 ? lineData : [{ day: "No data", submissions: 0, target: 0 }];

  const displayPieData =
    pieData?.length > 0 && pieData.some(item => item.value > 0)
      ? pieData
      : [{ name: "No data", value: 100, color: "#cccccc" }];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Orders Trend Chart */}
      <Card className="lg:col-span-3 bg-white p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#013763]">
            {activeRange === 'today' ? 'Today\'s Hourly Trend' : 'Submissions Trend'}
          </h3>
          <p className="text-sm text-gray-500">
            {activeRange === 'today' ? 'Hourly submissions vs target' : 'Daily submissions vs target'}
          </p>
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
                dataKey="submissions"
                stroke="#013763"
                strokeWidth={2}
                name="Submissions"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#bd171f"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Payment Split Pie Chart */}
      <Card className="bg-white p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#013763]">
            Submission Status
          </h3>
          <p className="text-sm text-gray-500">Status breakdown</p>
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
