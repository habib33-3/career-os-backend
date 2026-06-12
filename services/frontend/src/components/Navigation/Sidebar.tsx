"use client";

import Logo from "../shared/Logo";
import SidebarFooter from "./SidebarFooter";
import SidebarNav from "./SidebarNav";

const Sidebar = () => {
  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-border bg-sidebar md:flex">
      <div className="border-b border-border p-4">
        <Logo />
      </div>

      {/* Top Navigation */}
      <div className="flex-1 p-3">
        <SidebarNav />
      </div>

      {/* Bottom Utilities */}
      <SidebarFooter />
    </aside>
  );
};

export default Sidebar;
