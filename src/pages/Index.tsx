import { useState, useCallback } from "react";
import AppSidebar from "@/components/AppSidebar";
import ScheduleCalendar from "@/components/ScheduleCalendar";
import EmployeeDashboard from "@/components/EmployeeDashboard";
import { asignacionesIniciales, Asignacion } from "@/data/scheduling";

const Index = () => {
  const [currentView, setCurrentView] = useState<"schedule" | "dashboard">("schedule");
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>(asignacionesIniciales);

  const handleAddAssignment = useCallback((a: Omit<Asignacion, "id">) => {
    setAsignaciones((prev) => [
      ...prev,
      { ...a, id: `${a.colaboradorId}-${a.fecha}-${Date.now()}` },
    ]);
  }, []);

  const handleRemoveAssignment = useCallback((id: string) => {
    setAsignaciones((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {currentView === "schedule" ? (
          <ScheduleCalendar
            asignaciones={asignaciones}
            onAddAssignment={handleAddAssignment}
            onRemoveAssignment={handleRemoveAssignment}
          />
        ) : (
          <EmployeeDashboard asignaciones={asignaciones} />
        )}
      </main>
    </div>
  );
};

export default Index;
