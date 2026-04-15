import { proyectos, DESCANSO_ID } from "@/data/scheduling";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  onAssign: (proyectoId: string) => void;
}

const AssignmentDialog = ({ open, onClose, onAssign }: AssignmentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Asignar Proyecto</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          {proyectos.map((p) => (
            <button
              key={p.id}
              onClick={() => onAssign(p.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border border-border text-left transition-all hover:shadow-md hover:scale-[1.01]`}
            >
              <div className={`w-4 h-4 rounded-sm ${p.color}`} />
              <span className="font-medium text-sm text-foreground">{p.nombre}</span>
            </button>
          ))}
          <button
            onClick={() => onAssign(DESCANSO_ID)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border text-left transition-all hover:shadow-md hover:scale-[1.01]"
          >
            <div className="w-4 h-4 rounded-sm bg-project-descanso" />
            <span className="font-medium text-sm text-muted-foreground">DESCANSO</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDialog;
