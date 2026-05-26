import SidebarContent from "./SidebarContent";

const Sidebar = () => {
  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-sidebar md:flex">
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;
