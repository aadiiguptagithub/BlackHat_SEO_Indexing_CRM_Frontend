import React, { useState, useEffect } from "react";
import { Search, Trash2, Globe } from "lucide-react";
import { Switch } from "../../../components/ui/switch";
import { ipSettingsAPI } from "../../../services/api/ipSettings";
import { useToast } from "../../../hooks/use-toast";

export function IPSettings() {
  const { toast } = useToast();
  const [ipAddress, setIpAddress] = useState("");
  const [description, setDescription] = useState("");
  const [accessType, setAccessType] = useState("Allowed");
  const [securityStatus, setSecurityStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ipList, setIpList] = useState([]);
  const [summary, setSummary] = useState({
    active_count: 0,
    inactive_count: 0,
    security_status_last_updated_at: null,
  });

  // Fetch IP addresses and summary
  const fetchData = async () => {
    try {
      setLoading(true);
      const [ipResponse, summaryResponse] = await Promise.all([
        ipSettingsAPI.getIpAddresses(),
        ipSettingsAPI.getIpSummary(),
      ]);

      if (ipResponse.success) {
        const formattedIps = ipResponse.data.ip_addresses.map((ip) => ({
          id: ip.id,
          ip: ip.ip_address,
          description: ip.description,
          status: ip.status === "1" ? "Allowed" : "Blocked",
        }));
        setIpList(formattedIps);
      }

      if (summaryResponse.success) {
        const { data } = summaryResponse;
        setSummary({
          active_count: data.summary.active_count,
          inactive_count: data.summary.inactive_count,
          security_status_last_updated_at:
            data.summary.security_status_last_updated_at,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to fetch IP data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initialize data and security status
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const [ipResponse, summaryResponse] = await Promise.all([
          ipSettingsAPI.getIpAddresses(),
          ipSettingsAPI.getIpSummary(),
        ]);

        if (ipResponse.success) {
          const formattedIps = ipResponse.data.ip_addresses.map((ip) => ({
            id: ip.id,
            ip: ip.ip_address,
            description: ip.description || "",
            status: ip.status === "1" ? "Allowed" : "Blocked",
          }));
          setIpList(formattedIps);
        }

        if (summaryResponse.success) {
          const { data } = summaryResponse;
          setSummary({
            active_count: data.summary.active_count,
            inactive_count: data.summary.inactive_count,
            security_status_last_updated_at:
              data.summary.security_status_last_updated_at,
          });
          // Set initial security status
          setSecurityStatus(data.summary.active_count > 0);
        }
      } catch (err) {
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to fetch IP data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Filter list based on search and active tab
  const filteredIps = ipList.filter(
    (ip) =>
      ip &&
      ip.ip &&
      ip.description &&
      (activeTab === "All" || ip.status === activeTab) &&
      (ip.ip.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        ip.description
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  // Add new IP
  const handleAddIp = async () => {
    if (ipAddress.trim()) {
      try {
        const response = await ipSettingsAPI.addIpAddress({
          ip_address: ipAddress,
          description,
          status: accessType === "Allowed" ? "1" : "0",
        });

        if (response.success) {
          await fetchData();
          resetForm();
          toast({
            title: "Success",
            description: "IP address added successfully",
          });
        }
      } catch (err) {
        toast({
          title: "Error",
          description:
            err.response?.data?.message || "Failed to add IP address",
          variant: "destructive",
        });
      }
    }
  };

  // Delete IP
  const handleDeleteIp = async (id) => {
    try {
      const response = await ipSettingsAPI.deleteIpAddress(id);
      if (response.success) {
        await fetchData();
        toast({
          title: "Success",
          description: "IP address deleted successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to delete IP address",
        variant: "destructive",
      });
    }
  };

  // Edit IP
  const handleEditIp = (index) => {
    const ip = ipList[index];
    setEditIndex(index);
    setIpAddress(ip.ip);
    setDescription(ip.description);
    setAccessType(ip.status);
  };

  // Save Edited IP
  const handleSaveEdit = async () => {
    try {
      const ip = ipList[editIndex];
      const response = await ipSettingsAPI.updateIpAddress(ip.id, {
        ip_address: ipAddress,
        description,
        status: accessType === "Allowed" ? "1" : "0",
      });

      if (response.success) {
        await fetchData();
        resetForm();
        toast({
          title: "Success",
          description: "IP address updated successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to update IP address",
        variant: "destructive",
      });
    }
  };

  // Toggle Allowed/Blocked in list
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Allowed" ? "Blocked" : "Allowed";
      const response = await ipSettingsAPI.updateIpStatus(id, newStatus);

      if (response.success) {
        await fetchData();
        toast({
          title: "Success",
          description: "IP status updated successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to update IP status",
        variant: "destructive",
      });
    }
  };

  // Reset form fields
  const resetForm = () => {
    setEditIndex(null);
    setIpAddress("");
    setDescription("");
    setAccessType("Allowed");
  };

  return (
    <div className="container mx-auto px-4 py-4 space-y-4">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Add IP Form */}
        <div className="bg-white rounded-lg shadow p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold mb-3">+ Add IP Address</h2>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="IPv4 or IPv6 address"
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
            <select
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
              value={accessType}
              onChange={(e) => setAccessType(e.target.value)}
            >
              <option value="Allowed">Allow</option>
              <option value="Blocked">Block</option>
            </select>
          </div>

          <div className="mb-3">
            <input
              type="text"
              placeholder="Office Network"
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {editIndex !== null ? (
            <button
              onClick={handleSaveEdit}
              className="w-full bg-[#013763] hover:bg-[#001f3f] text-white py-1 rounded-md transition text-sm"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={handleAddIp}
              className="w-full bg-[#013763] hover:bg-[#001f3f] text-white py-1 rounded-md transition text-sm"
            >
              + Add IP
            </button>
          )}
        </div>

        {/* Security Status */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-sm font-semibold mb-3">Security Status</h2>
          <div className="flex items-center gap-2 mb-4">
            <Switch
              checked={securityStatus}
              onCheckedChange={async (checked) => {
                try {
                  const response = await ipSettingsAPI.updateSecurityStatus(
                    checked
                  );
                  if (response.success) {
                    setSecurityStatus(checked);
                    await fetchData();
                    toast({
                      title: "Success",
                      description: "Security status updated successfully",
                    });
                  }
                } catch (err) {
                  toast({
                    title: "Error",
                    description:
                      err.response?.data?.message ||
                      "Failed to update security status",
                    variant: "destructive",
                  });
                }
              }}
            />
            <span
              className={`font-medium text-sm ${
                securityStatus ? "text-green-600" : "text-red-600"
              }`}
            >
              {securityStatus ? "Activated" : "Deactivated"}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <p className="text-gray-500">Allowed IPs</p>
              <p className="font-semibold">{summary.active_count}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-500">Blocked IPs</p>
              <p className="font-semibold">{summary.inactive_count}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-500">Last Updated</p>
              <p className="font-semibold">
                {summary.security_status_last_updated_at
                  ? new Date(
                      summary.security_status_last_updated_at
                    ).toLocaleString()
                  : "Never"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* IP Access List */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-3">
          <h2 className="text-sm font-semibold">IP Access List</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search IP..."
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                activeTab === "All"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveTab("All")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                activeTab === "Allowed"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveTab("Allowed")}
            >
              Allowed
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                activeTab === "Blocked"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveTab("Blocked")}
            >
              Blocked
            </button>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading IP addresses...
            </div>
          ) : filteredIps.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No IP addresses found.
            </div>
          ) : (
            filteredIps.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border border-gray-200 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">{item.ip}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      item.status === "Allowed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                    onClick={() => handleToggleStatus(item.id, item.status)}
                  >
                    {item.status}
                  </button>
                  <button
                    className="text-gray-500 hover:text-blue-600 text-xs"
                    onClick={() => handleEditIp(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-gray-500 hover:text-red-600"
                    onClick={() => handleDeleteIp(item.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
