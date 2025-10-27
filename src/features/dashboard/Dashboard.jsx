import { useState, useEffect } from "react";
import { DashboardHeader } from "./components/DashboardHeader";
import { StatsCards } from "./components/StatsCards";
import { SalesChart } from "./components/SalesChart";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import {
  Briefcase,
  Send,
  TrendingUp,
  Users,
} from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();
  const [activeRange, setActiveRange] = useState("today");
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    return {
      startDate: startOfDay,
      endDate: endOfDay,
    };
  });
  const [metrics, setMetrics] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [submissionsData, setSubmissionsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      try {
        const metricsRes = await api.get('/metrics');
        if (metricsRes.success) {
          setMetrics(metricsRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        setMetrics({
          totals: { success: 0, failed: 0, pending: 0, running: 0 },
          today: { success: 0, failed: 0, pending: 0, running: 0 },
          jobs: { running: 0, queued: 0, completed: 0, failed: 0 }
        });
      }
      
      try {
        const jobsRes = await api.get('/jobs?limit=10');
        if (jobsRes.success) {
          const allJobs = jobsRes.data.data || [];
          const filteredJobs = allJobs.filter(job => {
            const jobDate = new Date(job.createdAt);
            return jobDate >= dateRange.startDate && jobDate <= dateRange.endDate;
          }).slice(0, 5);
          setRecentJobs(filteredJobs);
          
          const allSubmissions = [];
          for (const job of allJobs.slice(0, 3)) {
            try {
              const submissionsRes = await api.get(`/jobs/${job._id}/submissions?limit=50`);
              if (submissionsRes.success) {
                allSubmissions.push(...(submissionsRes.data.data || []));
              }
            } catch (err) {
              console.error(`Failed to fetch submissions for job ${job._id}:`, err);
            }
          }
          setSubmissionsData(allSubmissions);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        setRecentJobs([]);
        setSubmissionsData([]);
      }
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRangeChange = (range) => {
    setActiveRange(range);
    const today = new Date();
    const newRange = { endDate: new Date() };

    switch (range) {
      case "today":
        newRange.startDate = new Date();
        newRange.startDate.setHours(0, 0, 0, 0);
        newRange.endDate = new Date();
        newRange.endDate.setHours(23, 59, 59, 999);
        break;
      case "last7Days":
        newRange.startDate = new Date();
        newRange.startDate.setDate(today.getDate() - 7);
        break;
      case "last30Days":
        newRange.startDate = new Date();
        newRange.startDate.setDate(today.getDate() - 30);
        break;
      case "thisMonth":
        newRange.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      default:
        newRange.startDate = new Date();
        newRange.startDate.setDate(today.getDate() - 7);
        break;
    }

    setDateRange(newRange);
  };

  const stats = metrics ? [
    {
      title: activeRange === 'today' ? "Today's Submissions" : "Total Submissions",
      value: activeRange === 'today' 
        ? (metrics.today?.success || 0) + (metrics.today?.failed || 0)
        : (metrics.totals?.success || 0) + (metrics.totals?.failed || 0),
      icon: Send,
      change: activeRange === 'today' 
        ? `${metrics.today?.success || 0} successful`
        : `+${metrics.today?.success || 0} today`,
    },
    {
      title: "Success Rate",
      value: (() => {
        const total = activeRange === 'today'
          ? (metrics.today?.success || 0) + (metrics.today?.failed || 0)
          : (metrics.totals?.success || 0) + (metrics.totals?.failed || 0);
        const successful = activeRange === 'today'
          ? (metrics.today?.success || 0)
          : (metrics.totals?.success || 0);
        return `${Math.round((successful / Math.max(total, 1)) * 100)}%`;
      })(),
      icon: TrendingUp,
      change: activeRange === 'today'
        ? `${metrics.today?.success || 0}/${(metrics.today?.success || 0) + (metrics.today?.failed || 0)} today`
        : `${metrics.totals?.success || 0} total successful`,
    },
    {
      title: "Active Jobs",
      value: (metrics.jobs?.running || 0) + (metrics.jobs?.queued || 0),
      icon: Briefcase,
      change: `${metrics.jobs?.running || 0} running now`,
    },
    {
      title: "Pending Tasks",
      value: metrics.totals?.pending || 0,
      icon: Users,
      change: `${metrics.totals?.running || 0} processing`,
    },
  ] : [];

  const processSubmissionsForChart = () => {
    if (activeRange === 'today') {
      const hourlyData = [0, 0, 0, 0];
      submissionsData.forEach(submission => {
        const submissionDate = new Date(submission.createdAt || submission.updatedAt);
        if (submissionDate >= dateRange.startDate && submissionDate <= dateRange.endDate) {
          const hour = submissionDate.getHours();
          if (hour < 6) hourlyData[0]++;
          else if (hour < 12) hourlyData[1]++;
          else if (hour < 18) hourlyData[2]++;
          else hourlyData[3]++;
        }
      });
      return [
        { day: '00-06', submissions: hourlyData[0], target: Math.max(hourlyData[0] + 2, 5) },
        { day: '06-12', submissions: hourlyData[1], target: Math.max(hourlyData[1] + 3, 8) },
        { day: '12-18', submissions: hourlyData[2], target: Math.max(hourlyData[2] + 3, 8) },
        { day: '18-24', submissions: hourlyData[3], target: Math.max(hourlyData[3] + 2, 5) },
      ];
    } else {
      const dailyData = [0, 0, 0, 0, 0, 0, 0];
      submissionsData.forEach(submission => {
        const submissionDate = new Date(submission.createdAt || submission.updatedAt);
        if (submissionDate >= dateRange.startDate && submissionDate <= dateRange.endDate) {
          const dayOfWeek = submissionDate.getDay();
          const mondayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          dailyData[mondayIndex]++;
        }
      });
      return [
        { day: 'Mon', submissions: dailyData[0], target: Math.max(dailyData[0] + 5, 10) },
        { day: 'Tue', submissions: dailyData[1], target: Math.max(dailyData[1] + 5, 10) },
        { day: 'Wed', submissions: dailyData[2], target: Math.max(dailyData[2] + 5, 10) },
        { day: 'Thu', submissions: dailyData[3], target: Math.max(dailyData[3] + 5, 10) },
        { day: 'Fri', submissions: dailyData[4], target: Math.max(dailyData[4] + 5, 10) },
        { day: 'Sat', submissions: dailyData[5], target: Math.max(dailyData[5] + 3, 8) },
        { day: 'Sun', submissions: dailyData[6], target: Math.max(dailyData[6] + 3, 8) },
      ];
    }
  };

  const chartData = {
    lineData: processSubmissionsForChart(),
    pieData: [
      { 
        name: 'Successful', 
        value: activeRange === 'today' ? (metrics?.today?.success || 0) : (metrics?.totals?.success || 0), 
        color: '#10B981' 
      },
      { 
        name: 'Failed', 
        value: activeRange === 'today' ? (metrics?.today?.failed || 0) : (metrics?.totals?.failed || 0), 
        color: '#EF4444' 
      },
      { 
        name: 'Pending', 
        value: metrics?.totals?.pending || 0, 
        color: '#F59E0B' 
      },
      { 
        name: 'Running', 
        value: metrics?.totals?.running || 0, 
        color: '#3B82F6' 
      },
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#013763] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1920px] mx-auto p-4 sm:p-6">
        <DashboardHeader
          activeRange={activeRange}
          onRangeChange={handleRangeChange}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        <div className="mt-6">
          <StatsCards stats={stats} />
        </div>

        <div className="mt-6">
          <SalesChart 
            lineData={chartData.lineData} 
            pieData={chartData.pieData} 
            activeRange={activeRange}
          />
        </div>

        <div className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
              <span className="text-sm text-gray-500">
                {recentJobs.length} jobs in selected period
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentJobs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No jobs found in the selected date range
                      </td>
                    </tr>
                  ) : (
                    recentJobs.map((job) => (
                      <tr key={job._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {job.name || 'Unnamed Job'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            job.status === 'completed' ? 'bg-green-100 text-green-800' :
                            job.status === 'running' ? 'bg-blue-100 text-blue-800' :
                            job.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {job.status || 'unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.counts ? `${job.counts.success || 0}/${job.counts.total || 0}` : '0/0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Unknown'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}