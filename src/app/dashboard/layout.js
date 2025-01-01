import Sidebar, { SidebarItem, SignOutButton } from "@/components/sidebar";
import { Rings, Shop } from "iconoir-react";
import { BarChart3, Boxes, FileSliders, LayoutDashboard, Package, Plus, UserCircle, UserCogIcon } from "lucide-react";
import React from "react";
const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar>
        <SidebarItem icon={<LayoutDashboard size={20}/>} text="Dashboard" path="/dashboard"/>
        <SidebarItem icon={<BarChart3 size={20}/>} text="Statistics" path="/dashboard/stats" />
        <SidebarItem icon={<UserCircle size={20}/>} text="Users" path="/dashboard/users" />
        <SidebarItem icon={<Shop size={20}/>} text="Products" path="/dashboard/products"/>
        <SidebarItem icon={<Plus size={20}/>} text="Add Products" path="/dashboard/products/add"/>
        <SidebarItem icon={<Rings size={20}/>} text="Add Categories" path="/dashboard/categories/upload"/>
        <SidebarItem icon={<FileSliders size={20}/>} text="Add Slides" path="/dashboard/slides"/>
        <SidebarItem icon={<UserCogIcon size={20}/>} text="Admin User" path="/dashboard/admins"/>
        <SidebarItem icon={<Boxes size={20}/>} text="Inventory" path="/dashboard/inventory" />
        <SidebarItem icon={<Package size={20}/>} text="Orders" path="/dashboard/orders" />
        <SidebarItem icon={<Package size={20}/>} text="Coupon" path="/dashboard/coupon" />

      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[rgba(196,30,86,1)] font-mono">Admin Panel</h2>
          <div>
            <SignOutButton/>
          </div>
        </header>
        <section className="bg-white shadow-md rounded-lg p-6">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
