import React, { useState, useRef } from "react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Building,
  X,
  Save,
  Upload,
  Camera,
} from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../components/ui/avatar";

// Mock user data - replace with context/auth data later
const mockUser = {
  name: "Aditya",
  email: "aadiigupta25@gmail.com",
  role: "admin",
  phone: "+91 6306399254",
  address: "Rambagh Raidani Colony Mirzapur",
  department: "Administration",
  avatar: null,
};

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUser);
  const [formData, setFormData] = useState({ ...mockUser });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

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

  const getRoleLabel = (role) => {
    const labels = {
      admin: "Admin",
      preview: "Preview Department",
      accounts: "Accounts Department",
      printing: "Printing Department",
      delivery: "Delivery Department",
    };
    return labels[role] || role;
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({ ...userData });
    setPreviewImage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(null);
  };

  const handleSave = () => {
    const updatedUser = {
      ...formData,
      avatar: previewImage || userData.avatar,
    };
    setUserData(updatedUser);
    setIsEditing(false);
    // Here you would typically make an API call to save the data
    console.log("Saving user data:", updatedUser);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">
          View and manage your profile information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              {isEditing ? (
                <>
                  <Avatar
                    className="h-16 w-16 cursor-pointer"
                    onClick={triggerFileInput}
                  >
                    {previewImage ? (
                      <AvatarImage src={previewImage} />
                    ) : userData.avatar ? (
                      <AvatarImage src={userData.avatar} />
                    ) : (
                      <AvatarFallback>
                        <UserCircle className="h-10 w-10 text-gray-600" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full p-2"
                    onClick={triggerFileInput}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Avatar className="h-16 w-16">
                  {userData.avatar ? (
                    <AvatarImage src={userData.avatar} />
                  ) : (
                    <AvatarFallback>
                      <UserCircle className="h-10 w-10 text-gray-600" />
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
            </div>
            <div>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <Badge className={getRoleBadgeColor(userData.role)}>
                    {getRoleLabel(userData.role)}
                  </Badge>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{userData.name}</h2>
                  <Badge className={`mt-2 ${getRoleBadgeColor(userData.role)}`}>
                    {getRoleLabel(userData.role)}
                  </Badge>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {isEditing ? (
              <>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="h-5 w-5" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="h-5 w-5" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{userData.address}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Building className="h-5 w-5" />
                  <span>{userData.department}</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex space-x-3">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={handleEditClick}>Edit Profile</Button>
            )}
          </div>
        </Card>

        {/* Additional Information or Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Last login: Today at 9:30 AM
              </p>
            </div>
            {isEditing && previewImage && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600">
                  New profile image selected
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
