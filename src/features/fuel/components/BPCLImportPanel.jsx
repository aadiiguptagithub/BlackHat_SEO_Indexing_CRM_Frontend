import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Download,
  Eye,
  RefreshCw,
  X
} from "lucide-react";

const BPCLImportPanel = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  // Import process steps
  const importSteps = [
    { name: "File Validation", status: "completed" },
    { name: "Data Parsing", status: "completed" },
    { name: "Duplicate Check", status: "in-progress" },
    { name: "Trip Mapping", status: "pending" },
    { name: "Import Complete", status: "pending" }
  ];

  // Mock import history data
  const importHistory = [
    {
      id: 1,
      fileName: "BPCL_Transactions_Oct_11.xlsx",
      importTime: "2024-10-11 09:30:45",
      records: 1247,
      status: "completed",
      mapped: 1175,
      unmapped: 72
    },
    {
      id: 2,
      fileName: "BPCL_Transactions_Oct_10.csv",
      importTime: "2024-10-10 14:22:12",
      records: 1156,
      status: "completed",
      mapped: 1089,
      unmapped: 67
    },
    {
      id: 3,
      fileName: "BPCL_Transactions_Oct_09.xlsx",
      importTime: "2024-10-09 16:45:30",
      records: 998,
      status: "failed",
      error: "Invalid date format in row 234"
    },
    {
      id: 4,
      fileName: "BPCL_Transactions_Oct_08.csv",
      importTime: "2024-10-08 11:15:20",
      records: 1334,
      status: "completed",
      mapped: 1298,
      unmapped: 36
    }
  ];

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileUpload = (file) => {
    setUploading(true);
    setUploadProgress(0);
    setCurrentStep(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setCurrentStep(2);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50";
      case "failed": return "text-red-600 bg-red-50";
      case "in-progress": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "failed": return <AlertCircle className="h-4 w-4" />;
      case "in-progress": return <RefreshCw className="h-4 w-4 animate-spin" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#013763] flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          BPCL Import Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive 
              ? "border-[#013763] bg-blue-50" 
              : "border-gray-300 hover:border-[#013763]"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            {uploading ? (
              <div className="space-y-4">
                <RefreshCw className="h-8 w-8 text-[#013763] mx-auto animate-spin" />
                <div>
                  <p className="text-sm font-medium text-[#013763]">Uploading file...</p>
                  <Progress value={uploadProgress} className="mt-2" />
                  <p className="text-xs text-gray-500 mt-1">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                <div>
                  <p className="text-sm font-medium">Drop your BPCL file here</p>
                  <p className="text-xs text-gray-500">or click to browse</p>
                </div>
                <p className="text-xs text-gray-400">
                  Supports CSV, Excel files (max 25MB)
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-[#013763] text-[#013763] hover:bg-[#013763] hover:text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Import Progress Tracker */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Import Progress</h4>
          <div className="space-y-3">
            {importSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  step.status === "completed" 
                    ? "bg-green-100 text-green-600"
                    : step.status === "in-progress"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-400"
                }`}>
                  {step.status === "completed" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : step.status === "in-progress" ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-current" />
                  )}
                </div>
                <span className={`text-sm ${
                  step.status === "completed" 
                    ? "text-green-600 font-medium"
                    : step.status === "in-progress"
                    ? "text-blue-600 font-medium"
                    : "text-gray-500"
                }`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Import History Log */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Recent Imports</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {importHistory.slice(0, 5).map((import_) => (
              <div key={import_.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-900 truncate">
                    {import_.fileName}
                  </span>
                  <Badge className={`text-xs ${getStatusColor(import_.status)}`}>
                    {getStatusIcon(import_.status)}
                    <span className="ml-1">{import_.status}</span>
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">
                  {import_.importTime} • {import_.records} records
                </div>
                {import_.status === "completed" && (
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600">Mapped: {import_.mapped}</span>
                    <span className="text-orange-600">Unmapped: {import_.unmapped}</span>
                  </div>
                )}
                {import_.status === "failed" && (
                  <div className="text-xs text-red-600">
                    Error: {import_.error}
                  </div>
                )}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs h-6">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-6">
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { BPCLImportPanel };
