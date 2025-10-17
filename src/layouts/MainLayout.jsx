// import { useState } from "react";
// import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
// import { Button } from "../components/ui/button";
// import { UserProfileDropdown } from "../features/profile/components/UserProfileDropdown";
// import { UserCircle } from "lucide-react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   LayoutDashboard,
//   Users,
//   ClipboardList,
//   FileText,
//   UserCog,
//   Settings,
//   PlusCircle,
//   ListOrdered,
//   CreditCard,
//   Printer,
//   Hourglass,
//   CheckCircle,
//   Truck,
//   AlertTriangle,
//   RefreshCcw,
//   ChevronDown,
//   Bell,
// } from "lucide-react";
// import { cn } from "../lib/utils";

// const navigation = [
//   {
//     name: "Dashboard",
//     href: "/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     name: "Customers",
//     href: "/customers",
//     icon: Users,
//   },
//   {
//     name: "Orders",
//     href: "/orders",
//     icon: ClipboardList,
//     children: [
//       { name: "Create Order", href: "/orders/create", icon: PlusCircle },
//       { name: "Total Orders", href: "/orders/all", icon: ListOrdered },
//       {
//         name: "Pending Payment",
//         href: "/orders/pending-payment",
//         icon: CreditCard,
//       },
//       {
//         name: "Ready for Printing",
//         href: "/orders/ready-printing",
//         icon: Printer,
//       },
//       {
//         name: "Printing In Progress",
//         href: "/orders/printing",
//         icon: Hourglass,
//       },
//       { name: "Print Ready", href: "/orders/print-ready", icon: CheckCircle },
//       { name: "Ready for Delivery", href: "/orders/delivery", icon: Truck },
//       { name: "Urgent Orders", href: "/orders/urgent", icon: AlertTriangle },
//       {
//         name: "Replacement / FOC Orders",
//         href: "/orders/replacement",
//         icon: RefreshCcw,
//       },
//     ],
//   },
//   {
//     name: "Reports",
//     href: "/reports",
//     icon: FileText,
//   },
//   {
//     name: "Users & Role Management",
//     href: "/users",
//     icon: UserCog,
//   },
//   {
//     name: "Settings",
//     href: "/settings",
//     icon: Settings,
//     children: [
//       { name: "IP Setting", href: "/settings/ip", icon: Settings },
//       {
//         name: "WhatsApp API Integration",
//         href: "/settings/whatsapp",
//         icon: Settings,
//       },
//       { name: "Tally Integration", href: "/settings/tally", icon: Settings },
//       { name: "Manage Media", href: "/settings/media", icon: Settings },
//     ],
//   },
// ];

// export function MainLayout() {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const location = useLocation();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside
//         className={cn(
//           "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
//           isCollapsed ? "w-[4.5rem]" : "w-64"
//         )}
//       >
//         {/* Logo */}
//         <div
//           className={cn(
//             "flex items-center h-16 px-4 border-b border-gray-200",
//             isCollapsed ? "justify-center" : "justify-between"
//           )}
//         >
//           {!isCollapsed && (
//             <span className="text-lg font-semibold">RD Wallpaper CRM</span>
//           )}
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="text-gray-500 hover:text-gray-900"
//           >
//             {isCollapsed ? (
//               <ChevronRight className="h-5 w-5" />
//             ) : (
//               <ChevronLeft className="h-5 w-5" />
//             )}
//           </Button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 space-y-1 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
//           {navigation.map((item) => {
//             const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
//             const hasChildren = item.children?.length > 0;
//             const isActive =
//               location.pathname === item.href ||
//               (hasChildren &&
//                 item.children.some(
//                   (child) => location.pathname === child.href
//                 ));

//             const toggleSubmenu = (e) => {
//               if (hasChildren) {
//                 e.preventDefault();
//                 setIsSubmenuOpen(!isSubmenuOpen);
//               }
//             };

//             return (
//               <div key={item.name}>
//                 <div
//                   onClick={toggleSubmenu}
//                   className={cn(
//                     "flex items-center gap-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
//                     isActive
//                       ? "bg-gray-100 text-gray-900"
//                       : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
//                     isCollapsed && "justify-center"
//                   )}
//                 >
//                   {!hasChildren ? (
//                     <NavLink
//                       to={item.href}
//                       className="flex items-center gap-x-3 flex-1"
//                     >
//                       <item.icon className="h-5 w-5 flex-shrink-0" />
//                       {!isCollapsed && <span>{item.name}</span>}
//                     </NavLink>
//                   ) : (
//                     <>
//                       <item.icon className="h-5 w-5 flex-shrink-0" />
//                       {!isCollapsed && (
//                         <>
//                           <span className="flex-1">{item.name}</span>
//                           <ChevronDown
//                             className={cn(
//                               "h-4 w-4 transition-transform",
//                               isSubmenuOpen && "transform rotate-180"
//                             )}
//                           />
//                         </>
//                       )}
//                     </>
//                   )}
//                 </div>

//                 {hasChildren && !isCollapsed && isSubmenuOpen && (
//                   <div className="mt-1 ml-4 space-y-1">
//                     {item.children.map((child) => (
//                       <NavLink
//                         key={child.name}
//                         to={child.href}
//                         className={({ isActive }) =>
//                           cn(
//                             "flex items-center gap-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
//                             isActive
//                               ? "bg-gray-100 text-gray-900"
//                               : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
//                           )
//                         }
//                       >
//                         <child.icon className="h-4 w-4 flex-shrink-0" />
//                         <span>{child.name}</span>
//                       </NavLink>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </nav>

//         {/* User Profile Section */}
//         <div className="mt-auto border-t border-gray-200 flex-shrink-0">
//           {isCollapsed ? (
//             <Button
//               variant="ghost"
//               className="w-full p-4 flex justify-center"
//               onClick={() => setIsCollapsed(false)}
//             >
//               <UserCircle className="h-6 w-6 text-gray-600" />
//             </Button>
//           ) : (
//             <UserProfileDropdown />
//           )}
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main
//         className={cn(
//           "min-h-screen transition-all duration-300",
//           isCollapsed ? "pl-[4.5rem]" : "pl-64"
//         )}
//       >
//         <div className="py-6">
//           <Outlet />
//         </div>
//       </main>

//       {/* Notifications */}
//       <Button
//         variant="outline"
//         size="icon"
//         className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-white"
//       >
//         <Bell className="h-5 w-5" />
//       </Button>
//     </div>
//   );
// }
import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { UserProfileDropdown } from "../features/profile/components/UserProfileDropdown";
import { UserCircle } from "lucide-react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  UserCog,
  // Settings,
  ListOrdered,
  ChevronDown,
  Bell,
  Truck,
  Fuel,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { cn } from "../lib/utils";
import logoImage from "../assets/RRC-Logistics-logo.png";

// Color definitions based on logo colors
const PRIMARY_COLOR = "bg-[#013763]"; // Dark blue from logo
const PRIMARY_HOVER = "hover:bg-[#001f3f]"; // Darker blue for hover
const SECONDARY_COLOR = "bg-[#bd171f]"; // Red from logo
const SECONDARY_HOVER = "hover:bg-[#a01419]"; // Darker red for hover
const LIGHT_BACKGROUND = "bg-gray-50";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Master",
    href: "/master",
    icon: ClipboardList,
    children: [
      { name: "Driver", href: "/master/driver", icon: Users },
      { name: "Vehicle Average", href: "/master/vehicle-average", icon: TrendingUp },
      { name: "Vehicle Distance", href: "/master/vehicle-distance", icon: MapPin },
    ],
  },
  {
    name: "Trip Management",
    href: "/trips",
    icon: Truck,
  },
  {
    name: "Fuel Management",
    href: "/fuel",
    icon: Fuel,
  },
  {
    name: "Analytics and Reporting",
    href: "/reports",
    icon: FileText,
  },
  // {
  //   name: "Users & Role Management",
  //   href: "/users",
  //   icon: UserCog,
  // },
  // {
  //   name: "Settings",
  //   href: "/settings",
  //   icon: Settings,
  //   children: [
  //     { name: "IP Setting", href: "/settings/ip", icon: Settings },
  //     { name: "Manage Media", href: "/settings/media", icon: Settings },
  //     { name: "Manage Bank", href: "/settings/bank", icon: Settings },
  //   ],
  // },
];

export function MainLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={`min-h-screen ${LIGHT_BACKGROUND}`}>
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
            `flex items-center h-16 px-4 bg-white border-b border-gray-200`,
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!isCollapsed && (
            <img 
              src={logoImage} 
              alt="RRC Logistics" 
              className="h-14 w-auto max-w-[180px]"
            />
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
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
          {navigation.map((item) => {
            const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
            const hasChildren = item.children?.length > 0;
            const isActive =
              location.pathname === item.href ||
              (hasChildren &&
                item.children.some(
                  (child) => location.pathname === child.href
                ));

            const toggleSubmenu = (e) => {
              if (hasChildren) {
                e.preventDefault();
                setIsSubmenuOpen(!isSubmenuOpen);
              }
            };

            return (
              <div key={item.name}>
                <div
                  onClick={toggleSubmenu}
                  className={cn(
                    "flex items-center gap-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                    isActive
                      ? `${PRIMARY_COLOR} text-white shadow-md`
                      : "text-gray-600 hover:bg-gray-50",
                    isCollapsed && "justify-center"
                  )}
                >
                  {!hasChildren ? (
                    <NavLink
                      to={item.href}
                      className="flex items-center gap-x-3 flex-1"
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </NavLink>
                  ) : (
                    <>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isSubmenuOpen && "transform rotate-180"
                            )}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>

                {hasChildren && !isCollapsed && isSubmenuOpen && (
                  <div className="mt-1 ml-4 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.name}
                        to={child.href}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                            isActive
                              ? "bg-purple-50 text-purple-700"
                              : "text-gray-500 hover:bg-gray-50"
                          )
                        }
                      >
                        <child.icon className="h-4 w-4 flex-shrink-0" />
                        <span>{child.name}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto border-t border-gray-200 flex-shrink-0">
          {isCollapsed ? (
            <Button
              variant="ghost"
              className="w-full p-4 flex justify-center hover:bg-gray-100"
              onClick={() => setIsCollapsed(false)}
            >
              <UserCircle className="h-6 w-6 text-gray-600" />
            </Button>
          ) : (
            <UserProfileDropdown />
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

      {/* Notifications */}
      <Button
        variant="outline"
        size="icon"
        className={`fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg ${SECONDARY_COLOR} text-white hover:shadow-md ${SECONDARY_HOVER}`}
      >
        <Bell className="h-5 w-5" />
      </Button>
    </div>
  );
}
