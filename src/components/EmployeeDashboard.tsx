import { useState, useMemo } from "react";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, Briefcase, CalendarDays, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  colaboradores,
  Asignacion,
  getProjectName,
  getProjectColor,
  HORAS_EFECTIVAS,
  HORAS_JORNADA,
  HORAS_ALMUERZO,
  proyectos,
} from "@/data/scheduling";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmployeeDashboardProps {
  asignaciones: Asignacion[];
}

const EmployeeDashboard = ({ asignaciones }: EmployeeDashboardProps) => {
  const [selectedColabId, setSelectedColabId] = useState(colaboradores[0].id);
  const colab = colaboradores.find((c) => c.id === selectedColabId)!;

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const colabAssignments = useMemo(
    () => asignaciones.filter((a) => a.colaboradorId === selectedColabId),
    [asignaciones, selectedColabId]
  );

  const monthAssignments = useMemo(
    () =>
      colabAssignments.filter((a) => {
        const d = new Date(a.fecha);
        return d >= monthStart && d <= monthEnd;
      }),
    [colabAssignments, monthStart, monthEnd]
  );

  const totalHorasMes = monthAssignments.length * HORAS_EFECTIVAS;
  const diasTrabajados = monthAssignments.length;

  const horasPorProyecto = useMemo(() => {
    const map: Record<string, number> = {};
    monthAssignments.forEach((a) => {
      map[a.proyectoId] = (map[a.proyectoId] || 0) + HORAS_EFECTIVAS;
    });
    return Object.entries(map)
      .map(([id, horas]) => ({ id, nombre: getProjectName(id), horas, color: getProjectColor(id) }))
      .sort((a, b) => b.horas - a.horas);
  }, [monthAssignments]);

  const maxHoras = Math.max(...horasPorProyecto.map((p) => p.horas), 1);

  // Calendar mini
  const weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });

  const stats = [
    { icon: Clock, label: "Horas Efectivas", value: `${totalHorasMes}h`, desc: `de ${diasTrabajados * HORAS_JORNADA}h jornada` },
    { icon: CalendarDays, label: "Días Trabajados", value: `${diasTrabajados}`, desc: `en ${format(now, "MMMM", { locale: es })}` },
    { icon: Briefcase, label: "Proyectos Activos", value: `${horasPorProyecto.length}`, desc: "asignados este mes" },
    { icon: TrendingUp, label: "Almuerzo Descontado", value: `${diasTrabajados * HORAS_ALMUERZO}h`, desc: `${HORAS_ALMUERZO}h × ${diasTrabajados} días` },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Dashboard del Colaborador</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {format(now, "MMMM yyyy", { locale: es })}
          </p>
        </div>
        <Select value={selectedColabId} onValueChange={setSelectedColabId}>
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {colaboradores.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nombre} — {c.cargo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="stat-card"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hours by project */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border p-5 shadow-sm"
        >
          <h3 className="font-heading font-semibold text-foreground mb-4">Horas por Proyecto</h3>
          <div className="space-y-3">
            {horasPorProyecto.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin asignaciones este mes</p>
            )}
            {horasPorProyecto.map((p) => (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-sm ${p.color}`} />
                    <span className="text-sm font-medium text-foreground">{p.nombre}</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{p.horas}h</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(p.horas / maxHoras) * 100}%` }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className={`h-2 rounded-full ${p.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mini Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl border p-5 shadow-sm"
        >
          <h3 className="font-heading font-semibold text-foreground mb-4">
            Calendario — {format(now, "MMMM yyyy", { locale: es })}
          </h3>
          <div className="grid grid-cols-7 gap-1">
            {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">
                {d}
              </div>
            ))}
            {/* Offset for first day */}
            {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {monthDays.map((day) => {
              const fecha = day.toISOString().split("T")[0];
              const assignment = colabAssignments.find((a) => a.fecha === fecha);
              const isToday = isSameDay(day, now);
              return (
                <div
                  key={fecha}
                  className={`relative aspect-square flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
                    assignment
                      ? `${getProjectColor(assignment.proyectoId)} text-primary-foreground`
                      : "text-muted-foreground"
                  } ${isToday ? "ring-2 ring-accent ring-offset-1" : ""}`}
                  title={assignment ? getProjectName(assignment.proyectoId) : "Sin asignar"}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>
          {/* Mini legend */}
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border">
            {horasPorProyecto.map((p) => (
              <div key={p.id} className="flex items-center gap-1">
                <div className={`w-2.5 h-2.5 rounded-sm ${p.color}`} />
                <span className="text-[10px] text-muted-foreground">{p.nombre}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
