import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  LogOut,
} from "lucide-react";
import { cn } from "../lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Jobs",
    href: "/jobs",
    icon: ClipboardList,
  },
  {
    name: "Websites",
    href: "/websites",
    icon: Users,
  },
  {
    name: "Submissions",
    href: "/submissions",
    icon: FileText,
  },
];

export function MainLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 shadow-sm",
          isCollapsed ? "w-[4.5rem]" : "w-64"
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-16 px-4 bg-white border-b border-gray-200",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-900">
              Black Hat SEO
            </h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:bg-gray-100"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-[#013763] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50",
                  isCollapsed && "justify-center"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto border-t border-gray-200 p-4">
          {!isCollapsed && (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {user?.email || user?.type || 'User'}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-gray-500 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          isCollapsed ? "pl-[4.5rem]" : "pl-64"
        )}
      >
        <div className="py-6 px-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-3rem)] p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}