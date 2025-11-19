import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { EPI } from "@/types";
import { toast } from "sonner";

interface EPITableProps {
  epis: EPI[];
  onDelete: (id: string) => void;
  onUpdateCA: (epi: EPI) => void;
}

export const EPITable = ({ epis, onDelete, onUpdateCA }: EPITableProps) => {
  const [editingEPI, setEditingEPI] = useState<EPI | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    nome: "",
    validade: "",
    ca: "",
    tipo: "",
    uso: "",
    fabricante: "",
    entrega: "",
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleEditClick = (epi: EPI) => {
    setEditingEPI(epi);
    setEditForm({
      nome: epi.nome,
      validade: formatDateForInput(epi.validade),
      ca: epi.ca,
      tipo: epi.tipo,
      uso: epi.uso,
      fabricante: epi.fabricante,
      entrega: formatDateForInput(epi.entrega),
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEPI) return;

    setIsLoading(true);

    try {
      const updatedEPI: EPI = {
        ...editingEPI,
        nome: editForm.nome,
        validade: editForm.validade,
        ca: editForm.ca,
        tipo: editForm.tipo,
        uso: editForm.uso,
        fabricante: editForm.fabricante,
        entrega: editForm.entrega,
      };

      await onUpdateCA(updatedEPI);
      setIsEditDialogOpen(false);
      setEditingEPI(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar EPI");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este EPI?")) {
      onDelete(id);
      toast.success("EPI excluído com sucesso!");
    }
  };

  return (
    <Card className="animate-in fade-in duration-500">
      <CardHeader className="bg-gradient-primary">
        <CardTitle className="text-primary-foreground">Lista de EPIs</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>CA</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fabricante</TableHead>
                <TableHead>Data Entrega</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {epis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Nenhum EPI cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                epis.map((epi) => (
                  <TableRow key={epi.id}>
                    <TableCell className="font-medium">{epi.nome}</TableCell>
                    <TableCell>{formatDate(epi.validade)}</TableCell>
                    <TableCell>{epi.ca}</TableCell>
                    <TableCell>{epi.tipo}</TableCell>
                    <TableCell>{epi.fabricante}</TableCell>
                    <TableCell>{formatDate(epi.entrega)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Dialog open={isEditDialogOpen && editingEPI?.id === epi.id} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(epi)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Editar EPI</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-nome">Nome</Label>
                                <Input
                                  id="edit-nome"
                                  value={editForm.nome}
                                  onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-ca">CA</Label>
                                <Input
                                  id="edit-ca"
                                  value={editForm.ca}
                                  onChange={(e) => setEditForm({ ...editForm, ca: e.target.value })}
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-validade">Validade</Label>
                                <Input
                                  id="edit-validade"
                                  type="date"
                                  value={editForm.validade}
                                  onChange={(e) => setEditForm({ ...editForm, validade: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-entrega">Data de Entrega</Label>
                                <Input
                                  id="edit-entrega"
                                  type="date"
                                  value={editForm.entrega}
                                  onChange={(e) => setEditForm({ ...editForm, entrega: e.target.value })}
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-tipo">Tipo (Finalidade)</Label>
                                <Input
                                  id="edit-tipo"
                                  placeholder="Ex: Risco em Altura"
                                  value={editForm.tipo}
                                  onChange={(e) => setEditForm({ ...editForm, tipo: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-fabricante">Fabricante</Label>
                                <Input
                                  id="edit-fabricante"
                                  value={editForm.fabricante}
                                  onChange={(e) => setEditForm({ ...editForm, fabricante: e.target.value })}
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-uso">Modo de Uso</Label>
                              <Textarea
                                id="edit-uso"
                                value={editForm.uso}
                                onChange={(e) => setEditForm({ ...editForm, uso: e.target.value })}
                                required
                              />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                              {isLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Salvando...
                                </>
                              ) : (
                                "Salvar Alterações"
                              )}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(epi.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
