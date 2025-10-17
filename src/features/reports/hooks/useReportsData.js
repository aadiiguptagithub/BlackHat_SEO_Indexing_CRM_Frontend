/**
 * Custom hook for fetching and managing reports data
 * Provides data aggregation and caching for all report types
 */

import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * Main hook for reports data management
 */
export function useReportsData(options = {}) {
  const {
    initialLoad = true,
    cacheTimeout = 5 * 60 * 1000, // 5 minutes
    refetchInterval = null,
  } = options;

  const [data, setData] = useState({
    financial: null,
    production: null,
    quality: null,
    customers: null,
    performance: null,
  });

  const [loading, setLoading] = useState({
    financial: false,
    production: false,
    quality: false,
    customers: false,
    performance: false,
  });

  const [errors, setErrors] = useState({});
  const [lastFetch, setLastFetch] = useState({});

  // Mock data - Replace with actual API calls
  const mockApiData = {
    financial: {
      monthlyRevenue: [
        { month: "Jan", revenue: 285000, orders: 125, target: 300000 },
        { month: "Feb", revenue: 342000, orders: 148, target: 320000 },
        { month: "Mar", revenue: 298000, orders: 132, target: 310000 },
        { month: "Apr", revenue: 456000, orders: 187, target: 350000 },
        { month: "May", revenue: 389000, orders: 165, target: 380000 },
        { month: "Jun", revenue: 425000, orders: 178, target: 400000 },
      ],
      paymentStatus: { paid: 1108, pending: 89, overdue: 23, partial: 27 },
      revenueByMediaType: [
        { mediaType: "Vinyl Banner", revenue: 1200000, percentage: 42.1 },
        { mediaType: "Canvas Print", revenue: 680000, percentage: 23.9 },
        { mediaType: "Backdrop", revenue: 445000, percentage: 15.6 },
        { mediaType: "Banner", revenue: 325000, percentage: 11.4 },
        { mediaType: "Poster", revenue: 125000, percentage: 4.4 },
        { mediaType: "Menu Boards", revenue: 75000, percentage: 2.6 },
      ],
    },

    production: {
      workflowDistribution: {
        "Pending Payment": 89,
        "Ready for Printing": 45,
        "Printing In Progress": 23,
        "Print Ready": 34,
        "Ready for Delivery": 56,
        Completed: 1000,
      },
      machineUtilization: [
        {
          machine: "Printer A",
          utilization: 92.5,
          hoursRun: 185,
          totalHours: 200,
        },
        {
          machine: "Printer B",
          utilization: 87.3,
          hoursRun: 175,
          totalHours: 200,
        },
        {
          machine: "Printer C",
          utilization: 94.8,
          hoursRun: 190,
          totalHours: 200,
        },
        {
          machine: "Printer D",
          utilization: 78.6,
          hoursRun: 157,
          totalHours: 200,
        },
      ],
      averageCompletionTimes: {
        "Pending Payment": 2.3,
        "Ready for Printing": 1.8,
        "Printing In Progress": 6.5,
        "Print Ready": 2.1,
        "Ready for Delivery": 1.2,
      },
    },

    quality: {
      qualityScores: [
        { month: "Jan", score: 94.2, defects: 8, replacements: 5 },
        { month: "Feb", score: 96.8, defects: 4, replacements: 3 },
        { month: "Mar", score: 95.1, defects: 7, replacements: 4 },
        { month: "Apr", score: 97.3, defects: 3, replacements: 2 },
        { month: "May", score: 96.9, defects: 4, replacements: 3 },
        { month: "Jun", score: 98.1, defects: 2, replacements: 1 },
      ],
      defectsByCategory: {
        "Color mismatch": 15,
        "Physical damage": 8,
        "Size error": 6,
        "Material defect": 4,
        "Print quality": 3,
      },
      replacementCosts: 125000,
      focCosts: 45000,
    },

    customers: {
      satisfactionTrend: [
        { month: "Jan", score: 4.1, responses: 89 },
        { month: "Feb", score: 4.3, responses: 95 },
        { month: "Mar", score: 4.2, responses: 87 },
        { month: "Apr", score: 4.5, responses: 102 },
        { month: "May", score: 4.4, responses: 98 },
        { month: "Jun", score: 4.6, responses: 106 },
      ],
      customerSegments: {
        Corporate: { count: 89, revenue: 1250000, avgOrder: 28000 },
        "Small Business": { count: 234, revenue: 890000, avgOrder: 19000 },
        Individual: { count: 456, revenue: 445000, avgOrder: 9800 },
        "Event Management": { count: 123, revenue: 625000, avgOrder: 35000 },
      },
      repeatCustomers: 78.9,
      newCustomersThisMonth: 45,
    },

    performance: {
      Accounting: {
        efficiency: 96.2,
        ordersProcessed: 1247,
        avgProcessingTime: 2.3,
      },
      Printing: {
        efficiency: 87.5,
        ordersProcessed: 1158,
        avgProcessingTime: 6.8,
      },
      Delivery: {
        efficiency: 92.1,
        ordersProcessed: 1089,
        avgProcessingTime: 1.5,
      },
      "Customer Service": {
        efficiency: 94.8,
        issuesResolved: 156,
        avgResolutionTime: 4.2,
      },
    },
  };

  // Simulate API call
  const fetchData = useCallback(async (reportType, filters = {}) => {
    setLoading((prev) => ({ ...prev, [reportType]: true }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[reportType];
      return newErrors;
    });

    try {
      // Simulate API delay
      await new Promise((resolve) =>
        setTimeout(resolve, 500 + Math.random() * 1000)
      );

      // Simulate occasional errors for demonstration
      if (Math.random() < 0.05) {
        // 5% error rate
        throw new Error(`Failed to fetch ${reportType} data from server`);
      }

      // Apply filters to mock data
      let fetchedData = mockApiData[reportType];

      // Apply date filters if provided
      if (filters.dateRange && fetchedData) {
        // This would typically be handled on the server
        // For demo purposes, we'll just return the same data
        fetchedData = { ...fetchedData, filteredByDate: true };
      }

      setData((prev) => ({
        ...prev,
        [reportType]: fetchedData,
      }));

      setLastFetch((prev) => ({
        ...prev,
        [reportType]: Date.now(),
      }));
    } catch (error) {
      console.error(`Error fetching ${reportType} data:`, error);
      setErrors((prev) => ({
        ...prev,
        [reportType]: error.message,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [reportType]: false }));
    }
  }, []);

  // Check if data needs refresh based on cache timeout
  const needsRefresh = useCallback(
    (reportType) => {
      const lastFetchTime = lastFetch[reportType];
      if (!lastFetchTime) return true;

      return Date.now() - lastFetchTime > cacheTimeout;
    },
    [lastFetch, cacheTimeout]
  );

  // Fetch data for specific report type
  const fetchReportData = useCallback(
    (reportType, filters = {}, forceRefresh = false) => {
      if (!forceRefresh && !needsRefresh(reportType) && data[reportType]) {
        return Promise.resolve(data[reportType]);
      }

      return fetchData(reportType, filters);
    },
    [data, fetchData, needsRefresh]
  );

  // Fetch all reports data
  const fetchAllReports = useCallback(
    async (filters = {}) => {
      const reportTypes = [
        "financial",
        "production",
        "quality",
        "customers",
        "performance",
      ];

      const promises = reportTypes.map((type) =>
        fetchReportData(type, filters, true)
      );

      try {
        await Promise.all(promises);
      } catch (error) {
        console.error("Error fetching all reports:", error);
      }
    },
    [fetchReportData]
  );

  // Aggregate summary data
  const summaryData = useMemo(() => {
    if (!data.financial || !data.customers || !data.quality) {
      return null;
    }

    const totalRevenue =
      data.financial.monthlyRevenue?.reduce(
        (acc, item) => acc + item.revenue,
        0
      ) || 0;
    const totalOrders =
      data.financial.monthlyRevenue?.reduce(
        (acc, item) => acc + item.orders,
        0
      ) || 0;
    const avgSatisfaction =
      data.customers.satisfactionTrend?.reduce(
        (acc, item) => acc + item.score,
        0
      ) / (data.customers.satisfactionTrend?.length || 1) || 0;
    const avgQuality =
      data.quality.qualityScores?.reduce((acc, item) => acc + item.score, 0) /
        (data.quality.qualityScores?.length || 1) || 0;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      customerSatisfaction: avgSatisfaction,
      qualityScore: avgQuality,
      onTimeDelivery: 94.2, // This would come from production data
      productionEfficiency: data.performance?.Printing?.efficiency || 0,
      customerRetention: data.customers?.repeatCustomers || 0,
    };
  }, [data]);

  // Initial data fetch
  useEffect(() => {
    if (initialLoad) {
      fetchAllReports();
    }
  }, [initialLoad, fetchAllReports]);

  // Set up refetch interval
  useEffect(() => {
    if (refetchInterval) {
      const interval = setInterval(() => {
        fetchAllReports();
      }, refetchInterval);

      return () => clearInterval(interval);
    }
  }, [refetchInterval, fetchAllReports]);

  // Get loading state for all reports
  const isLoading = useMemo(() => {
    return Object.values(loading).some(Boolean);
  }, [loading]);

  // Get error state
  const hasErrors = useMemo(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  // Refresh specific report
  const refreshReport = useCallback(
    (reportType, filters = {}) => {
      return fetchReportData(reportType, filters, true);
    },
    [fetchReportData]
  );

  // Clear errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Get cached data age
  const getDataAge = useCallback(
    (reportType) => {
      const lastFetchTime = lastFetch[reportType];
      if (!lastFetchTime) return null;

      const ageInMs = Date.now() - lastFetchTime;
      const ageInMinutes = Math.floor(ageInMs / (1000 * 60));

      if (ageInMinutes < 1) return "Just now";
      if (ageInMinutes === 1) return "1 minute ago";
      if (ageInMinutes < 60) return `${ageInMinutes} minutes ago`;

      const ageInHours = Math.floor(ageInMinutes / 60);
      if (ageInHours === 1) return "1 hour ago";
      if (ageInHours < 24) return `${ageInHours} hours ago`;

      const ageInDays = Math.floor(ageInHours / 24);
      if (ageInDays === 1) return "1 day ago";
      return `${ageInDays} days ago`;
    },
    [lastFetch]
  );

  return {
    // Data
    data,
    summaryData,

    // Loading states
    loading,
    isLoading,

    // Error states
    errors,
    hasErrors,
    clearErrors,

    // Actions
    fetchReportData,
    fetchAllReports,
    refreshReport,

    // Utils
    needsRefresh,
    getDataAge,
    lastFetch,
  };
}

/**
 * Hook for real-time data updates
 */
export function useRealTimeReports(baseData, updateInterval = 30000) {
  const [realtimeData, setRealtimeData] = useState(baseData);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setRealtimeData((prevData) => {
        // Add small random changes to simulate real-time updates
        const updatedData = { ...prevData };

        // Update some random metrics
        if (updatedData.financial?.monthlyRevenue) {
          const lastMonth =
            updatedData.financial.monthlyRevenue[
              updatedData.financial.monthlyRevenue.length - 1
            ];
          if (lastMonth) {
            lastMonth.revenue += Math.floor(Math.random() * 10000) - 5000; // ±5000 random change
            lastMonth.orders += Math.floor(Math.random() * 10) - 5; // ±5 orders
          }
        }

        return updatedData;
      });

      setLastUpdate(Date.now());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return {
    data: realtimeData,
    lastUpdate,
    isRealTime: true,
  };
}

/**
 * Hook for report data comparison
 */
export function useReportComparison(currentData, previousData) {
  const comparison = useMemo(() => {
    if (!currentData || !previousData) return null;

    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      revenue: {
        current: currentData.totalRevenue || 0,
        previous: previousData.totalRevenue || 0,
        change: calculateChange(
          currentData.totalRevenue || 0,
          previousData.totalRevenue || 0
        ),
      },
      orders: {
        current: currentData.totalOrders || 0,
        previous: previousData.totalOrders || 0,
        change: calculateChange(
          currentData.totalOrders || 0,
          previousData.totalOrders || 0
        ),
      },
      satisfaction: {
        current: currentData.customerSatisfaction || 0,
        previous: previousData.customerSatisfaction || 0,
        change: calculateChange(
          currentData.customerSatisfaction || 0,
          previousData.customerSatisfaction || 0
        ),
      },
    };
  }, [currentData, previousData]);

  return comparison;
}
