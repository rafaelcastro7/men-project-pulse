import { Calendar, Users, LayoutDashboard, Building2 } from "lucide-react";

interface AppSidebarProps {
  currentView: "schedule" | "dashboard";
  onViewChange: (view: "schedule" | "dashboard") => void;
}

const AppSidebar = ({ currentView, onViewChange }: AppSidebarProps) => {
  return (
    <aside className="w-64 min-h-screen bg-primary text-primary-foreground flex flex-col">
      {/* Logo area */}
      <div className="px-6 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Building2 className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold tracking-tight">MEN</h1>
            <p className="text-xs opacity-70 font-body">INGENIERÍA S.A.S.</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <button
          onClick={() => onViewChange("schedule")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            currentView === "schedule"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          }`}
        >
          <Calendar className="w-5 h-5" />
          Programación
        </button>
        <button
          onClick={() => onViewChange("dashboard")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            currentView === "dashboard"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Mi Dashboard
        </button>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-medium">Admin</p>
            <p className="opacity-60">Recursos Humanos</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
