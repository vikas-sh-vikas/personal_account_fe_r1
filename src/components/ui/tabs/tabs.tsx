'use client';

import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { Home, BarChart2, Wallet, User } from "lucide-react";
import { motion } from "framer-motion";

function Tabs() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { label: "Home", path: "/dashboard", icon: Home },
    { label: "Transactions", path: "/dashboard/transactions", icon: BarChart2 },
    { label: "Account", path: "/dashboard/banks", icon: Wallet },
    { label: "Profile", path: "/dashboard/profile", icon: User },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 h-16 glass-card rounded-2xl flex items-center justify-around px-2 z-50 shadow-2xl border border-white/20">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className="relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200"
            >
              <div className={`p-1 rounded-xl transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-muted-foreground'}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? 'text-primary opacity-100' : 'text-muted-foreground opacity-70'}`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTabMobile"
                  className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 glass-card border-r border-white/10 flex-col py-8 px-4 z-50 shadow-xl">
        <div className="mb-12 px-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Personal Account
          </h1>
        </div>
        
        <div className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path;
            const Icon = tab.icon;
            return (
              <button
                key={tab.path}
                onClick={() => router.push(tab.path)}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary/10 text-primary shadow-sm' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium text-sm">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabDesktop"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default Tabs;
