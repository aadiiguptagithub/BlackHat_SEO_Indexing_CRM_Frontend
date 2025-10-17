import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Badge } from "../../../components/ui/badge";
import {
  UserCircle,
  Settings,
  LogOut,
  KeyRound,
  ChevronUp,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useToast } from "../../../hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";

export function UserProfileDropdown() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      // Clear any local storage or session data
      localStorage.clear();
      sessionStorage.clear();

      toast({
        title: "👋 Logged out successfully",
        description: "You have been logged out of your account",
      });

      // Navigate to login page with replace to prevent going back
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "❌ Error",
        description: "Failed to logout. Please try again.",
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full px-3 py-2 h-auto justify-start hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center w-full gap-3">
              <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "No email"}
                </p>
                <Badge
                  variant="secondary"
                  className={`mt-1 text-xs ${getRoleBadgeColor(user?.role)}`}
                >
                  {getRoleLabel(user?.role || "user")}
                </Badge>
              </div>
              <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[240px] mb-2"
          side="top"
          sideOffset={8}
        >
          <DropdownMenuItem
            className="py-3 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            <span>View Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3 cursor-pointer"
            onClick={() => setIsChangePasswordOpen(true)}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            <span>Change Password</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3 cursor-pointer text-red-600 focus:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangePasswordDialog
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
}

function ChangePasswordDialog({ isOpen, onClose }) {
  const { toast } = useToast();
  const { changePassword } = useAuth();
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      if (newPassword !== confirmPassword) {
        toast({
          title: "❌ Error",
          description: "New passwords do not match",
          variant: "destructive",
        });
        return;
      }

      // Password validation
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        toast({
          title: "❌ Invalid Password",
          description:
            "Password must be at least 8 characters and include letters and numbers",
          variant: "destructive",
        });
        return;
      }

      // Call the changePassword function from auth context
      await changePassword(oldPassword, newPassword);

      toast({
        title: "✅ Success",
        description: "Password has been updated successfully",
      });

      // Reset form and close dialog
      onClose();
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Change password error:", error);
      toast({
        title: "❌ Error",
        description:
          error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new one. The new password
            must be at least 8 characters long and include both letters and
            numbers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
