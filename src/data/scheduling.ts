export interface Colaborador {
  id: string;
  nombre: string;
  cedula: string;
  cargo: string;
}

export interface Proyecto {
  id: string;
  nombre: string;
  color: string;
}

export interface Asignacion {
  id: string;
  colaboradorId: string;
  proyectoId: string;
  fecha: string; // YYYY-MM-DD
}

export const HORAS_JORNADA_LV = 8; // Lunes a Viernes
export const HORAS_ALMUERZO = 1;   // Solo L-V
export const HORAS_EFECTIVAS_LV = HORAS_JORNADA_LV + HORAS_ALMUERZO; // 9h total en obra L-V
export const HORAS_SABADO = 4;     // Sábado sin almuerzo

/** Horas normales según día de la semana (0=Dom, 6=Sáb) */
export function getHorasNormales(dayOfWeek: number): number {
  if (dayOfWeek === 0) return 0; // Domingo
  if (dayOfWeek === 6) return HORAS_SABADO; // Sábado
  return HORAS_JORNADA_LV; // L-V (8h trabajo, almuerzo aparte)
}

/** Horas totales en obra (incluye almuerzo L-V) */
export function getHorasTotalEnObra(dayOfWeek: number): number {
  if (dayOfWeek === 0) return 0;
  if (dayOfWeek === 6) return HORAS_SABADO;
  return HORAS_JORNADA_LV + HORAS_ALMUERZO; // 9h en obra
}

export const proyectos: Proyecto[] = [
  { id: "novaterra", nombre: "NOVATERRA", color: "bg-project-novaterra" },
  { id: "torre-atrio", nombre: "TORRE ATRIO", color: "bg-project-atrio" },
  { id: "cajica-compensar", nombre: "CAJICA COMPENSAR", color: "bg-project-cajica" },
  { id: "torre-barcelona", nombre: "TORRE BARCELONA", color: "bg-project-barcelona" },
  { id: "torres-castilla", nombre: "TORRES DE CASTILLA", color: "bg-project-castilla" },
];

export const colaboradores: Colaborador[] = [
  { id: "1", nombre: "Francisco Sánchez", cedula: "1234", cargo: "Líder" },
  { id: "2", nombre: "Miguel Hernández", cedula: "5678", cargo: "Oficial" },
  { id: "3", nombre: "Sebastián Pérez", cedula: "9876", cargo: "Oficial" },
  { id: "4", nombre: "Andrés Pérez", cedula: "5432", cargo: "Soldador" },
  { id: "5", nombre: "Juan Torres", cedula: "9128", cargo: "Armador" },
];

// Generate sample assignments for current 2 weeks
function generateSampleAssignments(): Asignacion[] {
  const assignments: Asignacion[] = [];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

  const patterns: Record<string, string[]> = {
    "1": ["novaterra", "novaterra", "novaterra", "novaterra", "novaterra", "novaterra", "DESCANSO",
          "novaterra", "novaterra", "novaterra", "novaterra", "novaterra", "novaterra", "DESCANSO"],
    "2": ["cajica-compensar", "cajica-compensar", "cajica-compensar", "novaterra", "novaterra", "novaterra", "DESCANSO",
          "novaterra", "novaterra", "novaterra", "novaterra", "novaterra", "novaterra", "DESCANSO"],
    "3": ["torre-atrio", "torre-atrio", "torre-atrio", "torre-atrio", "torre-atrio", "torre-atrio", "DESCANSO",
          "torre-atrio", "torre-atrio", "torre-atrio", "torre-atrio", "torre-atrio", "torre-atrio", "torre-atrio"],
    "4": ["novaterra", "novaterra", "novaterra", "novaterra", "novaterra", "novaterra", "DESCANSO",
          "novaterra", "novaterra", "novaterra", "novaterra", "novaterra", "novaterra", "DESCANSO"],
    "5": ["torre-atrio", "torre-atrio", "torre-atrio", "torre-atrio", "torre-atrio", "torre-atrio", "DESCANSO",
          "torre-barcelona", "torre-barcelona", "torre-barcelona", "torre-barcelona", "torre-barcelona", "torre-barcelona", "torre-barcelona"],
  };

  Object.entries(patterns).forEach(([colabId, pattern]) => {
    pattern.forEach((proyectoId, dayOffset) => {
      if (proyectoId !== "DESCANSO") {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + dayOffset);
        assignments.push({
          id: `${colabId}-${dayOffset}`,
          colaboradorId: colabId,
          proyectoId,
          fecha: date.toISOString().split("T")[0],
        });
      }
    });
  });

  return assignments;
}

export const asignacionesIniciales = generateSampleAssignments();

export const DESCANSO_ID = "DESCANSO";

export function getProjectColor(proyectoId: string): string {
  if (proyectoId === DESCANSO_ID) return "bg-project-descanso";
  const p = proyectos.find((p) => p.id === proyectoId);
  return p?.color || "bg-muted";
}

export function getProjectName(proyectoId: string): string {
  if (proyectoId === DESCANSO_ID) return "DESCANSO";
  const p = proyectos.find((p) => p.id === proyectoId);
  return p?.nombre || "";
}

export function getProjectTextColor(proyectoId: string): string {
  return "text-primary-foreground";
}
