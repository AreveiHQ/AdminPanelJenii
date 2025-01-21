"use client"
import Sidebar, { SidebarItem } from "@/components/sidebar";
import {  LogOut,  } from "iconoir-react";
import { BarChart3, Boxes,  Layers2, Plus, ShoppingBag,  UserCogIcon, UsersRound } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import {  MdOutlineDashboardCustomize, MdSpaceDashboard } from "react-icons/md";
import { RiCoupon2Fill } from "react-icons/ri";

const Layout = ({ children }) => {
  const {data} = useSession();
  const [expanded, setExpanded] = useState(true)
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar expanded={expanded}>
        <SidebarItem icon={<MdSpaceDashboard size={20}/>} text="Dashboard" path="/dashboard"/>
        <SidebarItem icon={<BarChart3 size={20}/>} text="Statistics" path="/dashboard/stats" />
        <SidebarItem icon={<UsersRound size={20}/>} text="Users" path="/dashboard/users" />
        <SidebarItem icon={<ShoppingBag size={20}/>} text="Products" path="/dashboard/products"/>
        <SidebarItem icon={<Plus size={20}/>} text="Add Products" path="/dashboard/products/add"/>
        <SidebarItem icon={<MdOutlineDashboardCustomize size={20}/>} text="Add Categories" path="/dashboard/categories/upload"/>
        <SidebarItem icon={<Layers2 size={20}/>} text="Add Slides" path="/dashboard/slides"/>
        <SidebarItem icon={<UserCogIcon size={20}/>} text="Admin User" path="/dashboard/admins"/>
        <SidebarItem icon={<Boxes size={20}/>} text="Inventory" path="/dashboard/inventory" />
        <SidebarItem icon={<FiShoppingCart size={20}/>} text="Orders" path="/dashboard/orders" />
        <SidebarItem icon={<RiCoupon2Fill size={20}/>} text="Coupon" path="/dashboard/coupon" />

      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 ">
       
        <section className="bg-white shadow-md rounded-lg min-h-screen ">

    <div className="flex items-center justify-between px-4 py-2 bg-white shadow-md">
      {/* Left - Hamburger Menu */}
      <button className="p-2 rounded-full hover:bg-gray-100" onClick={()=>setExpanded((curr) => !curr)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* Center - Icons */}
      <div className="flex items-center gap-4">
      
      </div>

      {/* Right - User Profile */}
     { data && <div className="flex items-center gap-3">
      <div className="flex items-center gap-3">
        <div className="flex flex-col text-right">
          <span className="text-sm font-medium text-gray-700">{data.user?.username}</span>
          <span className="text-xs text-gray-500 ">{data.user?.email}</span>
        </div>

        <div className="w-10 h-10 overflow-hidden flex justify-center items-center rounded-full border-2 bg-[rgba(196,30,86,1)] text-white border-gray-300">
        {data.user?.username.charAt(0)}
        </div>
      </div>
      <button className="p-2 rounded-full hover:bg-gray-100" onClick={()=>signOut()}>
          <LogOut/>
        </button>
      </div>}
      
    </div>
  

          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
