import React, { useState, useEffect } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { userAPI } from "../../../services/api/users";
import {
  UserCircle,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
} from "lucide-react";
import { useToast } from "../../../hooks/use-toast";
import { AddUserModal } from "./AddUserModal";
import { EditUserModal } from "./EditUserModal";
import { DeleteUserDialog } from "./DeleteUserDialog";

// Role definitions for the application

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "preview", label: "Preview Department" },
  { value: "accounts", label: "Accounts Department" },
  { value: "printing", label: "Printing Department" },
  { value: "delivery", label: "Delivery Department" },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export function Users() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [refreshKey, setRefreshKey] = useState(0); // Add this to force refresh when needed

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUsers();
      if (response.success) {
        const formattedUsers = response.data.users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status === "1" ? "active" : "inactive",
          role: user.role,
          avatar: user.profile_image,
          mobile: user.mobile,
        }));
        setUsers(formattedUsers);
      } else {
        throw new Error(response.message || "Failed to fetch users");
      }
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshKey]); // Add refreshKey to the dependency array to allow manual refresh
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Filter users based on search term and filter type
  const filteredUsers = users.filter((user) => {
    const searchValue = searchTerm.toLowerCase();
    if (searchFilter === "role") {
      return user.role.toLowerCase().includes(searchValue);
    }
    return user[searchFilter].toLowerCase().includes(searchValue);
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Handle user actions
  const handleAddUser = async (userData) => {
    try {
      const response = await userAPI.createUser({
        ...userData,
        status: "1", // Set default status to active
      });
      if (response.success) {
        setRefreshKey((key) => key + 1); // Force a refresh of the users list
        setIsAddModalOpen(false);
        toast({
          title: "Success",
          description: "User added successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async (userData) => {
    try {
      // Convert status to match API format
      const apiUserData = {
        ...userData,
        status: userData.status === "active" ? "1" : "0",
      };
      const response = await userAPI.updateUser(userData.id, apiUserData);
      if (response.success) {
        setRefreshKey((key) => key + 1); // Force a refresh of the users list
        setIsEditModalOpen(false);
        setSelectedUser(null);
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await userAPI.deleteUser(userId);
      if (response.success) {
        setRefreshKey((key) => key + 1); // Force a refresh of the users list
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    }
  };

  // Toggle user status between active and inactive
  const toggleUserStatus = async (userId) => {
    try {
      const user = users.find((u) => u.id === userId);
      const newStatus = user.status === "active" ? "0" : "1";
      const response = await userAPI.toggleUserStatus(userId, newStatus);
      if (response.success) {
        setRefreshKey((key) => key + 1); // Force a refresh of the users list
        toast({
          title: "Success",
          description: "User status updated successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-purple-100 text-purple-800",
      preview: "bg-blue-100 text-blue-800",
      accounts: "bg-green-100 text-green-800",
      printing: "bg-yellow-100 text-yellow-800",
      delivery: "bg-orange-100 text-orange-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <UsersIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        </div>
        <p className="text-gray-600">
          Manage your team members and their permissions
        </p>
      </div>

      {/* Search and Filter Section */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Select value={searchFilter} onValueChange={setSearchFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="role">Role</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 flex-1 md:w-auto">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="min-w-[200px]"
              />
              <Button variant="secondary">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto"
          >
            + Add User
          </Button>
        </div>
      </Card>

      {/* Users List */}
      <Card className="mb-6 overflow-hidden">
        <div className="divide-y">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading users...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <UserCircle className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    className="cursor-pointer"
                  >
                    <Badge
                      variant={
                        user.status === "active" ? "success" : "secondary"
                      }
                    >
                      {user.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </button>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {ROLES.find((r) => r.value === user.role)?.label}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500 hover:text-red-600" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No users found. Try adjusting your search or add a new user.
            </div>
          )}
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)}{" "}
          of {filteredUsers.length} results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(v) => setItemsPerPage(Number(v))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE_OPTIONS.map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUser}
        roles={ROLES}
      />
      {selectedUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={handleEditUser}
          user={selectedUser}
          roles={ROLES}
        />
      )}
      {selectedUser && (
        <DeleteUserDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={() => handleDeleteUser(selectedUser.id)}
          userName={selectedUser.name}
        />
      )}
    </div>
  );
}
