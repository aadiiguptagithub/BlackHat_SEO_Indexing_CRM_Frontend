import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Button } from "../../../components/ui/button";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Download, Maximize2 } from "lucide-react";

// Mock data for charts
const consumptionTrendData = [
  { date: '05-10', consumption: 2456, average: 2300, target: 2500 },
  { date: '06-10', consumption: 2234, average: 2280, target: 2500 },
  { date: '07-10', consumption: 2567, average: 2350, target: 2500 },
  { date: '08-10', consumption: 2123, average: 2320, target: 2500 },
  { date: '09-10', consumption: 2789, average: 2400, target: 2500 },
  { date: '10-10', consumption: 2445, average: 2420, target: 2500 },
  { date: '11-10', consumption: 2856, average: 2450, target: 2500 }
];

const efficiencyData = [
  { vehicle: 'MH-12-AB-1234', efficiency: 3.2, category: 'excellent' },
  { vehicle: 'GJ-05-CD-5678', efficiency: 2.8, category: 'good' },
  { vehicle: 'KA-03-EF-9012', efficiency: 2.5, category: 'average' },
  { vehicle: 'TN-09-GH-3456', efficiency: 2.1, category: 'poor' },
  { vehicle: 'RJ-14-IJ-7890', efficiency: 1.8, category: 'poor' },
  { vehicle: 'UP-16-KL-2345', efficiency: 3.0, category: 'good' },
  { vehicle: 'MP-18-MN-6789', efficiency: 2.7, category: 'good' },
  { vehicle: 'HR-21-OP-3456', efficiency: 2.3, category: 'average' },
  { vehicle: 'PB-22-QR-7890', efficiency: 2.9, category: 'good' },
  { vehicle: 'DL-01-ST-2345', efficiency: 3.4, category: 'excellent' }
];

const varianceData = [
  { name: 'Normal (<5%)', value: 68, color: '#10b981' },
  { name: 'Low (5-10%)', value: 18, color: '#3b82f6' },
  { name: 'Medium (10-15%)', value: 9, color: '#f59e0b' },
  { name: 'High (>15%)', value: 5, color: '#ef4444' }
];

const stationData = [
  { station: 'BPCL Pune', diesel: 4500, petrol: 1200, month: 'Oct' },
  { station: 'BPCL Mumbai', diesel: 5200, petrol: 1800, month: 'Oct' },
  { station: 'BPCL Ahmedabad', diesel: 3800, petrol: 900, month: 'Oct' },
  { station: 'BPCL Bangalore', diesel: 4100, petrol: 1100, month: 'Oct' },
  { station: 'BPCL Chennai', diesel: 3600, petrol: 800, month: 'Oct' },
  { station: 'BPCL Jaipur', diesel: 2900, petrol: 600, month: 'Oct' }
];

export const InteractiveCharts = ({ reportType }) => {
  const [activeTab, setActiveTab] = useState("consumption");

  const getEfficiencyColor = (category) => {
    switch (category) {
      case 'excellent': return '#10b981'; // Green
      case 'good': return '#3b82f6';      // Blue
      case 'average': return '#f59e0b';   // Amber
      case 'poor': return '#ef4444';      // Red
      default: return '#6b7280';          // Gray
    }
  };

  const renderCustomTooltip = (active, payload, label) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey.includes('efficiency') ? ' KM/L' : entry.dataKey.includes('consumption') ? ' L' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#013763]">
            Interactive Analytics
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="consumption" className="text-xs">
              Consumption 
            </TabsTrigger>
            {/* <TabsTrigger value="efficiency" className="text-xs">
              Efficiency Analysis
            </TabsTrigger>
            <TabsTrigger value="variance" className="text-xs">
              Variance Distribution
            </TabsTrigger>
            <TabsTrigger value="station" className="text-xs">
              Station Analysis
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="consumption" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={consumptionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip content={({ active, payload, label }) => renderCustomTooltip(active, payload, label)} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="consumption" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                    name="Daily Consumption (L)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="7-day Average (L)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Target Line (L)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="efficiency" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={efficiencyData.slice(0, 10)} 
                  layout="horizontal"
                  margin={{ left: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    type="number" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="vehicle" 
                    stroke="#6b7280"
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip content={({ active, payload, label }) => renderCustomTooltip(active, payload, label)} />
                  <Bar 
                    dataKey="efficiency" 
                    fill={(entry) => getEfficiencyColor(entry.category)}
                    name="Efficiency (KM/L)"
                  >
                    {efficiencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getEfficiencyColor(entry.category)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="variance" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={varianceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {varianceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-4">
                <div className="text-2xl font-bold text-[#013763]">100</div>
                <div className="text-sm text-gray-500">Total Variance Cases</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="station" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="station" 
                    stroke="#6b7280"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip content={({ active, payload, label }) => renderCustomTooltip(active, payload, label)} />
                  <Legend />
                  <Bar 
                    dataKey="diesel" 
                    stackId="a" 
                    fill="#3b82f6"
                    name="Diesel (L)"
                  />
                  <Bar 
                    dataKey="petrol" 
                    stackId="a" 
                    fill="#10b981"
                    name="Petrol (L)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
