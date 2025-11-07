import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { EPI } from "@/types";
import { toast } from "sonner";
import { EPIAPI } from "@/lib/api";

interface UpdateCAModalProps {
  epi: EPI | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, ca: string, validade: string) => void;
}

export const UpdateCAModal = ({ epi, open, onClose, onUpdate }: UpdateCAModalProps) => {
  const [ca, setCA] = useState("");
  const [validade, setValidade] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (epi) {
      setCA(epi.ca);
      setValidade(epi.validade);
    }
  }, [epi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!epi) return;

    setIsLoading(true);
    try {
      // Chamar API para atualizar o EPI
      const validadeDate = new Date(validade).toISOString();
      await EPIAPI.atualizar(epi.ca, {
        CA: ca,
        validade: validadeDate,
      });

      onUpdate(epi.id, ca, validade);
      toast.success("EPI atualizado com sucesso!");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar EPI");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="bg-gradient-primary -mx-6 -mt-6 px-6 py-4 mb-4 rounded-t-lg">
          <DialogTitle className="text-primary-foreground">Atualizar CA</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="update-ca">Novo CA</Label>
            <Input
              id="update-ca"
              value={ca}
              onChange={(e) => setCA(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="update-validade">Nova Validade</Label>
            <Input
              id="update-validade"
              type="date"
              value={validade}
              onChange={(e) => setValidade(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="bg-gradient-primary w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
