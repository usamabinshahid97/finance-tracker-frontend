"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "supertokens-auth-react/recipe/session";
import {
  HomeIcon,
  CreditCardIcon,
  ArrowsRightLeftIcon,
  DocumentTextIcon,
  FolderIcon,
  ChartBarIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Accounts", href: "/accounts", icon: CreditCardIcon },
    { name: "Transactions", href: "/transactions", icon: ArrowsRightLeftIcon },
    { name: "Statements", href: "/statements", icon: DocumentTextIcon },
    { name: "Categories", href: "/categories", icon: FolderIcon },
    { name: "Reports", href: "/reports", icon: ChartBarIcon },
  ];

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/auth/signin";
  };

  return (
    <div className="h-screen bg-slate-100">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-40 flex">
          {/* Sidebar overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-slate-600/75"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`
            fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
              <h1 className="text-xl font-bold text-slate-900">
                Finance Tracker
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-2 py-4 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center px-4 py-2 mt-2 text-sm font-medium rounded-md
                      ${
                        isActive
                          ? "text-white bg-blue-600"
                          : "text-slate-700 hover:bg-slate-100"
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-200">
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-100"
              >
                <UserCircleIcon className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col h-full border-r border-slate-200 bg-white">
          <div className="flex items-center h-16 px-4 border-b border-slate-200">
            <h1 className="text-xl font-bold text-slate-900">
              Finance Tracker
            </h1>
          </div>
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-2 mt-2 text-sm font-medium rounded-md
                    ${
                      isActive
                        ? "text-white bg-blue-600"
                        : "text-slate-700 hover:bg-slate-100"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-100"
            >
              <UserCircleIcon className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex h-16 bg-white border-b border-slate-200 lg:hidden">
          <button
            type="button"
            className="px-4 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex items-center justify-center flex-1">
            <h1 className="text-lg font-medium">Finance Tracker</h1>
          </div>
        </div>

        {/* Content area */}
        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
