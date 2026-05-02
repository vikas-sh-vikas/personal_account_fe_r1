"use client";
import Header from "@/components/ui/header/Header";
import Tabs from "@/components/ui/tabs/tabs";
import React from "react";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Sidebar / Bottom Nav */}
      <Tabs />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-grow p-4 lg:p-8 overflow-y-auto lg:ml-64 pb-24 lg:pb-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default layout;
