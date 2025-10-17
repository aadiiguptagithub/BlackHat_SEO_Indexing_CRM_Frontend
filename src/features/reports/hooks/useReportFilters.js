/**
 * Custom hook for managing report filters
 * Provides filtering logic for all report types
 */

import { useState, useEffect, useMemo, useCallback } from "react";

/**
 * Hook for managing report filters with advanced filtering capabilities
 */
export function useReportFilters(initialData = [], initialFilters = {}) {
  const [filters, setFilters] = useState({
    dateRange: { from: null, to: null },
    textSearch: "",
    status: "all",
    priority: "all",
    category: "all",
    department: "all",
    customFilters: {},
    ...initialFilters,
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  // Apply all filters to the data
  const filteredData = useMemo(() => {
    let filtered = [...initialData];

    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(
          item.createdAt || item.date || item.timestamp
        );

        if (filters.dateRange.from && itemDate < filters.dateRange.from) {
          return false;
        }

        if (filters.dateRange.to && itemDate > filters.dateRange.to) {
          return false;
        }

        return true;
      });
    }

    // Text search filter (searches multiple fields)
    if (filters.textSearch) {
      const searchTerm = filters.textSearch.toLowerCase();
      filtered = filtered.filter((item) => {
        const searchableFields = [
          "name",
          "title",
          "description",
          "customerName",
          "orderNumber",
          "mediaType",
          "notes",
        ];

        return searchableFields.some((field) =>
          item[field]?.toString().toLowerCase().includes(searchTerm)
        );
      });
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((item) => item.status === filters.status);
    }

    // Priority filter
    if (filters.priority && filters.priority !== "all") {
      filtered = filtered.filter((item) => item.priority === filters.priority);
    }

    // Category filter
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    // Department filter
    if (filters.department && filters.department !== "all") {
      filtered = filtered.filter(
        (item) =>
          item.department === filters.department ||
          item.assignedDepartment === filters.department ||
          item.responsibleDepartment === filters.department
      );
    }

    // Custom filters
    Object.entries(filters.customFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        filtered = filtered.filter((item) => {
          if (Array.isArray(value)) {
            return value.includes(item[key]);
          }

          if (
            typeof value === "object" &&
            value.min !== undefined &&
            value.max !== undefined
          ) {
            const itemValue = parseFloat(item[key]);
            return itemValue >= value.min && itemValue <= value.max;
          }

          return item[key] === value;
        });
      }
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle different data types
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        if (aValue instanceof Date && bValue instanceof Date) {
          return sortConfig.direction === "asc"
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }

        // String comparison
        const aStr = String(aValue || "").toLowerCase();
        const bStr = String(bValue || "").toLowerCase();

        if (sortConfig.direction === "asc") {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }

    return filtered;
  }, [initialData, filters, sortConfig]);

  // Update individual filter
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Update custom filter
  const updateCustomFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      customFilters: {
        ...prev.customFilters,
        [key]: value,
      },
    }));
  }, []);

  // Update date range
  const updateDateRange = useCallback((from, to) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: { from, to },
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      dateRange: { from: null, to: null },
      textSearch: "",
      status: "all",
      priority: "all",
      category: "all",
      department: "all",
      customFilters: {},
    });
    setSortConfig({ key: null, direction: "asc" });
  }, []);

  // Clear specific filter
  const clearFilter = useCallback(
    (key) => {
      if (key === "dateRange") {
        updateDateRange(null, null);
      } else if (key === "customFilters") {
        setFilters((prev) => ({
          ...prev,
          customFilters: {},
        }));
      } else {
        setFilters((prev) => ({
          ...prev,
          [key]: key === "textSearch" ? "" : "all",
        }));
      }
    },
    [updateDateRange]
  );

  // Handle sorting
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.dateRange.from !== null ||
      filters.dateRange.to !== null ||
      filters.textSearch !== "" ||
      filters.status !== "all" ||
      filters.priority !== "all" ||
      filters.category !== "all" ||
      filters.department !== "all" ||
      Object.keys(filters.customFilters).length > 0
    );
  }, [filters]);

  // Get filter summary
  const filterSummary = useMemo(() => {
    const activeFilters = [];

    if (filters.dateRange.from || filters.dateRange.to) {
      activeFilters.push("Date Range");
    }

    if (filters.textSearch) {
      activeFilters.push(`Search: "${filters.textSearch}"`);
    }

    if (filters.status !== "all") {
      activeFilters.push(`Status: ${filters.status}`);
    }

    if (filters.priority !== "all") {
      activeFilters.push(`Priority: ${filters.priority}`);
    }

    if (filters.category !== "all") {
      activeFilters.push(`Category: ${filters.category}`);
    }

    if (filters.department !== "all") {
      activeFilters.push(`Department: ${filters.department}`);
    }

    Object.entries(filters.customFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        activeFilters.push(`${key}: ${value}`);
      }
    });

    return activeFilters;
  }, [filters]);

  // Export current filtered data
  const exportFiltered = useCallback(
    (format = "csv") => {
      return {
        data: filteredData,
        filters: filterSummary,
        totalRecords: filteredData.length,
        originalRecords: initialData.length,
      };
    },
    [filteredData, filterSummary, initialData.length]
  );

  return {
    // Data
    filteredData,
    originalData: initialData,

    // Filter state
    filters,
    sortConfig,
    hasActiveFilters,
    filterSummary,

    // Filter actions
    updateFilter,
    updateCustomFilter,
    updateDateRange,
    clearFilters,
    clearFilter,

    // Sorting
    handleSort,

    // Utils
    exportFiltered,

    // Statistics
    totalFiltered: filteredData.length,
    totalOriginal: initialData.length,
    filterRatio:
      initialData.length > 0
        ? (filteredData.length / initialData.length) * 100
        : 0,
  };
}

/**
 * Specialized hook for date-based report filtering
 */
export function useDateRangeFilter(data, dateField = "createdAt") {
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const filteredData = useMemo(() => {
    if (!dateRange.from && !dateRange.to) return data;

    return data.filter((item) => {
      const itemDate = new Date(item[dateField]);

      if (dateRange.from && itemDate < dateRange.from) return false;
      if (dateRange.to && itemDate > dateRange.to) return false;

      return true;
    });
  }, [data, dateRange, dateField]);

  const presetRanges = {
    today: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return { from: today, to: tomorrow };
    },

    thisWeek: () => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);

      return { from: startOfWeek, to: endOfWeek };
    },

    thisMonth: () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      return { from: startOfMonth, to: endOfMonth };
    },

    last30Days: () => {
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);

      return { from: thirtyDaysAgo, to: now };
    },
  };

  const applyPreset = (presetName) => {
    const preset = presetRanges[presetName];
    if (preset) {
      setDateRange(preset());
    }
  };

  return {
    filteredData,
    dateRange,
    setDateRange,
    applyPreset,
    presetRanges: Object.keys(presetRanges),
    clearDateRange: () => setDateRange({ from: null, to: null }),
  };
}
