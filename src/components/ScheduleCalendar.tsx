import { useState, useMemo } from "react";
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { motion } from "framer-motion";
import {
  colaboradores,
  proyectos,
  Asignacion,
  DESCANSO_ID,
  getProjectColor,
  getProjectName,
  HORAS_EFECTIVAS,
} from "@/data/scheduling";
import AssignmentDialog from "./AssignmentDialog";

interface ScheduleCalendarProps {
  asignaciones: Asignacion[];
  onAddAssignment: (a: Omit<Asignacion, "id">) => void;
  onRemoveAssignment: (id: string) => void;
}

const ScheduleCalendar = ({ asignaciones, onAddAssignment, onRemoveAssignment }: ScheduleCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ colaboradorId: string; fecha: string } | null>(null);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 14 }, (_, i) => addDays(weekStart, i));

  const getAssignment = (colaboradorId: string, fecha: string) =>
    asignaciones.find((a) => a.colaboradorId === colaboradorId && a.fecha === fecha);

  const handleCellClick = (colaboradorId: string, fecha: string) => {
    const existing = getAssignment(colaboradorId, fecha);
    if (existing) {
      onRemoveAssignment(existing.id);
    } else {
      setSelectedCell({ colaboradorId, fecha });
      setDialogOpen(true);
    }
  };

  const totalHorasByColab = useMemo(() => {
    const totals: Record<string, number> = {};
    colaboradores.forEach((c) => {
      const count = asignaciones.filter(
        (a) => a.colaboradorId === c.id && days.some((d) => d.toISOString().split("T")[0] === a.fecha)
      ).length;
      totals[c.id] = count * HORAS_EFECTIVAS;
    });
    return totals;
  }, [asignaciones, days]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Programa de Turnos</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {format(weekStart, "d MMM", { locale: es })} — {format(addDays(weekStart, 13), "d MMM yyyy", { locale: es })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(subWeeks(currentDate, 2))}
            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Hoy
          </button>
          <button
            onClick={() => setCurrentDate(addWeeks(currentDate, 2))}
            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {proyectos.map((p) => (
          <div key={p.id} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${p.color}`} />
            <span className="text-xs text-muted-foreground">{p.nombre}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-project-descanso" />
          <span className="text-xs text-muted-foreground">DESCANSO</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="sticky left-0 bg-muted/80 backdrop-blur-sm z-10 px-4 py-3 text-left font-heading font-semibold text-foreground min-w-[180px]">
                  Colaborador
                </th>
                <th className="px-2 py-3 text-center font-heading font-semibold text-foreground min-w-[60px]">Cargo</th>
                {days.map((day) => {
                  const isToday = isSameDay(day, new Date());
                  const isSunday = day.getDay() === 0;
                  return (
                    <th
                      key={day.toISOString()}
                      className={`px-1 py-3 text-center min-w-[90px] ${isToday ? "bg-accent/10" : ""} ${isSunday ? "bg-destructive/5" : ""}`}
                    >
                      <div className="text-xs text-muted-foreground uppercase">
                        {format(day, "EEE", { locale: es })}
                      </div>
                      <div className={`text-sm font-semibold ${isToday ? "text-accent" : "text-foreground"}`}>
                        {format(day, "d")}
                      </div>
                    </th>
                  );
                })}
                <th className="px-3 py-3 text-center font-heading font-semibold text-foreground min-w-[70px]">
                  Horas
                </th>
              </tr>
            </thead>
            <tbody>
              {colaboradores.map((colab, idx) => (
                <motion.tr
                  key={colab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="sticky left-0 bg-card z-10 px-4 py-2 font-medium text-foreground whitespace-nowrap">
                    {colab.nombre}
                  </td>
                  <td className="px-2 py-2 text-center text-xs text-muted-foreground whitespace-nowrap">{colab.cargo}</td>
                  {days.map((day) => {
                    const fecha = day.toISOString().split("T")[0];
                    const assignment = getAssignment(colab.id, fecha);
                    const isSunday = day.getDay() === 0;
                    return (
                      <td
                        key={fecha}
                        className={`px-1 py-1.5 text-center ${isSunday ? "bg-destructive/5" : ""}`}
                      >
                        <button
                          onClick={() => handleCellClick(colab.id, fecha)}
                          className={`w-full px-1 py-1.5 rounded-md text-[10px] font-semibold transition-all hover:scale-105 hover:shadow-md ${
                            assignment
                              ? `${getProjectColor(assignment.proyectoId)} text-primary-foreground`
                              : "bg-muted/50 text-muted-foreground hover:bg-muted border border-dashed border-border"
                          }`}
                        >
                          {assignment ? (
                            getProjectName(assignment.proyectoId)
                          ) : (
                            <Plus className="w-3 h-3 mx-auto opacity-40" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 text-center">
                    <span className="inline-flex items-center justify-center min-w-[40px] px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {totalHorasByColab[colab.id] || 0}h
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hours note */}
      <p className="text-xs text-muted-foreground mt-3 text-right">
        * Jornada de {8}h — 1h almuerzo = <strong>{HORAS_EFECTIVAS}h efectivas</strong> por día
      </p>

      {/* Assignment Dialog */}
      <AssignmentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAssign={(proyectoId) => {
          if (selectedCell) {
            onAddAssignment({ ...selectedCell, proyectoId });
            setDialogOpen(false);
          }
        }}
      />
    </div>
  );
};

export default ScheduleCalendar;
