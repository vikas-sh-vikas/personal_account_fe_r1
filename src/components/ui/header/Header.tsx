"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Tabs from "../tabs/tabs";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { User, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  const {data:session} = useSession()
  function loagoutHandler() {
    signOut()
  }
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <header className="sticky top-0 z-40 w-full lg:ml-64 lg:w-[calc(100%-16rem)] glass-nav border-b border-white/10">
      <div className="mx-auto flex h-16 items-center justify-between px-4 lg:px-8 max-w-7xl">
        {/* Mobile Logo */}
        <div className="lg:hidden font-bold text-xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          PA
        </div>

        {/* Search or Title placeholder */}
        <div className="hidden lg:flex items-center text-sm text-muted-foreground font-medium">
          Dashboard / {session?.user?.name || 'User'}
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              {session?.user?.image ? (
                <Image
                  src={session?.user.image}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-primary/20 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary border-2 border-primary/30">
                  <User size={20} />
                </div>
              )}
            </button>

            {open && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 mt-2 w-56 glass-card border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-white/10">
                  <p className="text-sm font-semibold">{session?.user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      router.push("/dashboard/profile");
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-white/5 transition"
                  >
                    <User size={16} /> View Profile
                  </button>
                  <button
                    onClick={() => {
                      loagoutHandler();
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-500/10 transition"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
