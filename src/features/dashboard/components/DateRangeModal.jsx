"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DateRangeModal({
  open,
  onOpenChange,
  dateRange,
  onDateRangeChange,
}) {
  const [localRange, setLocalRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    if (open) {
      setLocalRange(dateRange);
    }
  }, [open, dateRange]);

  const handleApply = () => {
    if (localRange.startDate > localRange.endDate) {
      alert("End date must be after start date");
      return;
    }
    onDateRangeChange(localRange);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] rounded-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#013763]">
            Select Date Range
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-900">
              Start Date
            </label>
            <Input
              type="date"
              value={localRange.startDate.toISOString().split("T")[0]}
              onChange={(e) =>
                setLocalRange((prev) => ({
                  ...prev,
                  startDate: new Date(e.target.value),
                }))
              }
              className="border-gray-300 focus:ring-purple-600 focus:border-purple-600"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900">
              End Date
            </label>
            <Input
              type="date"
              value={localRange.endDate.toISOString().split("T")[0]}
              onChange={(e) =>
                setLocalRange((prev) => ({
                  ...prev,
                  endDate: new Date(e.target.value),
                }))
              }
              min={localRange.startDate.toISOString().split("T")[0]}
              className="border-gray-300 focus:ring-purple-600 focus:border-purple-600"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-[#013763] text-white hover:bg-[#001f3f]"
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
