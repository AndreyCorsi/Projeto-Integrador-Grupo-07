import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Edit2, Trash2, Plus, AlertTriangle, Search, User, FileText, Eye } from "lucide-react";
import { EPI, Funcionario, EPIAtribuicao } from "@/types";
import { toast } from "sonner";
import { differenceInDays, parseISO } from "date-fns";
import { generateFichaEPI } from "@/lib/pdfGenerator";

interface FuncionarioEPIManagerProps {
  funcionarios: Funcionario[];
  epis: EPI[];
  atribuicoes: EPIAtribuicao[];
  onAssignEPI: (epiId: string, funcionarioId: string) => void;
  onUnassignEPI: (atribuicaoId: string) => void;
  onUpdateCA: (epi: EPI) => void;
  onDeleteEPI: (id: string) => void;
  onUpdateFuncionario: (funcionario: Funcionario) => void;
  onUpdateAtribuicaoValidade: (atribuicaoId: string, validade: string) => void;
  onDeleteFuncionario: (id: string) => void;
}

export const FuncionarioEPIManager = ({ 
  funcionarios, 
  epis,
  atribuicoes,
  onAssignEPI,
  onUnassignEPI,
  onUpdateCA,
  onDeleteEPI,
  onUpdateFuncionario,
  onUpdateAtribuicaoValidade,
  onDeleteFuncionario
}: FuncionarioEPIManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
  const [editForm, setEditForm] = useState({
    nome: "",
    cpf: "",
    cargo: "",
    setor: ""
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEPIs, setSelectedEPIs] = useState<Record<string, string>>({});
  const [editingAtribuicao, setEditingAtribuicao] = useState<{ atribuicaoId: string; validade: string } | null>(null);
  const [isValidadeDialogOpen, setIsValidadeDialogOpen] = useState(false);
  const [viewingEPI, setViewingEPI] = useState<EPI | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingEPI, setEditingEPI] = useState<EPI | null>(null);
  const [isEditEPIDialogOpen, setIsEditEPIDialogOpen] = useState(false);
  const [editEPIForm, setEditEPIForm] = useState({
    nome: "",
    ca: "",
    tipo: "",
    fabricante: "",
    validade: "",
    entrega: "",
    uso: ""
  });
  
  const getExpirationStatus = (validade: string) => {
    const days = differenceInDays(parseISO(validade), new Date());
    
    if (days < 0) {
      return { status: "expired", label: "Vencida", variant: "destructive" as const, days };
    } else if (days <= 30) {
      return { status: "warning", label: "Vence em breve", variant: "default" as const, days };
    }
    return { status: "valid", label: "Válida", variant: "secondary" as const, days };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este EPI?")) {
      onDeleteEPI(id);
      toast.success("EPI excluído com sucesso!");
    }
  };

  const handleDeleteFuncionario = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este funcionário?")) {
      onDeleteFuncionario(id);
      toast.success("Funcionário excluído com sucesso!");
    }
  };

  const handleEditClick = (funcionario: Funcionario) => {
    setEditingFuncionario(funcionario);
    setEditForm({
      nome: funcionario.nome,
      cpf: funcionario.cpf,
      cargo: funcionario.cargo,
      setor: funcionario.setor
    });
    setIsEditDialogOpen(true);
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFuncionario) {
      onUpdateFuncionario({
        ...editingFuncionario,
        ...editForm
      });
      setIsEditDialogOpen(false);
      setEditingFuncionario(null);
      toast.success("Funcionário atualizado com sucesso!");
    }
  };

  const handleEditEPIClick = (epi: EPI & { atribuicaoId: string }) => {
    setEditingEPI(epi);
    setEditEPIForm({
      nome: epi.nome,
      ca: epi.ca,
      tipo: epi.tipo,
      fabricante: epi.fabricante,
      validade: epi.validade,
      entrega: epi.entrega,
      uso: epi.uso
    });
    setIsEditEPIDialogOpen(true);
  };

  const handleEditEPISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEPI) {
      onUpdateCA({
        ...editingEPI,
        ...editEPIForm
      });
      setIsEditEPIDialogOpen(false);
      setEditingEPI(null);
      toast.success("EPI atualizado com sucesso!");
    }
  };

  const handleExportPDF = (funcionario: Funcionario) => {
    const funcionarioAtribuicoes = atribuicoes.filter(at => at.funcionarioId === funcionario.id);
    const funcionarioEPIsData = funcionarioAtribuicoes.map(at => {
      const epi = epis.find(e => e.id === at.epiId);
      return {
        epi: epi!,
        atribuicao: at
      };
    }).filter(item => item.epi);

    if (funcionarioEPIsData.length === 0) {
      toast.error("Funcionário não possui EPIs atribuídos");
      return;
    }

    generateFichaEPI(funcionario, funcionarioEPIsData);
    toast.success("PDF gerado com sucesso!");
  };

  const filteredFuncionarios = funcionarios.filter(funcionario => {
    // Buscar por nome do funcionário
    if (funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    }
    
    // Buscar por CA dos EPIs atribuídos ao funcionário
    const funcionarioAtribuicoes = atribuicoes.filter(at => at.funcionarioId === funcionario.id);
    const funcionarioHasMatchingCA = funcionarioAtribuicoes.some(at => {
      const epi = epis.find(e => e.id === at.epiId);
      return epi && epi.ca.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    return funcionarioHasMatchingCA;
  });

  return (
    <div className="space-y-6">
      {/* Campo de pesquisa */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Pesquisar por nome do funcionário ou CA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {funcionarios.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Nenhum funcionário cadastrado
          </CardContent>
        </Card>
      ) : filteredFuncionarios.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Nenhum funcionário encontrado para "{searchTerm}"
          </CardContent>
        </Card>
      ) : (
        filteredFuncionarios.map((funcionario) => {
          const funcionarioAtribuicoes = atribuicoes.filter(at => at.funcionarioId === funcionario.id);
          const funcionarioEPIs = funcionarioAtribuicoes.map(at => {
            const epi = epis.find(e => e.id === at.epiId);
            return epi ? { ...epi, atribuicaoId: at.id, validade: at.validade } : null;
          }).filter(Boolean) as (EPI & { atribuicaoId: string })[];
          
          return (
            <Card key={funcionario.id} className="animate-in fade-in duration-500">
              <CardHeader className="bg-gradient-primary">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-primary-foreground">{funcionario.nome}</CardTitle>
                      <Dialog open={isEditDialogOpen && editingFuncionario?.id === funcionario.id} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditClick(funcionario)}
                            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                          >
                            <User className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Funcionário</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                              <Label htmlFor="edit-nome">Nome Completo</Label>
                              <Input
                                id="edit-nome"
                                value={editForm.nome}
                                onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-cpf">CPF</Label>
                              <Input
                                id="edit-cpf"
                                value={editForm.cpf}
                                onChange={(e) => setEditForm({ ...editForm, cpf: formatCPF(e.target.value) })}
                                maxLength={14}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-cargo">Cargo</Label>
                              <Input
                                id="edit-cargo"
                                value={editForm.cargo}
                                onChange={(e) => setEditForm({ ...editForm, cargo: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-setor">Setor</Label>
                              <Input
                                id="edit-setor"
                                value={editForm.setor}
                                onChange={(e) => setEditForm({ ...editForm, setor: e.target.value })}
                                required
                              />
                            </div>
                            <Button type="submit" className="w-full">
                              Salvar Alterações
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleExportPDF(funcionario)}
                        className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteFuncionario(funcionario.id)}
                        className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-primary-foreground/80 mt-1">
                      {funcionario.cargo} - {funcionario.setor}
                    </p>
                    <p className="text-xs text-primary-foreground/60 mt-1">
                      CPF: {funcionario.cpf}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {funcionarioEPIs.length} EPI(s)
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Atribuir novo EPI */}
                {epis.length > 0 && (
                  <div className="mb-4 flex gap-2">
                    <Select 
                      value={selectedEPIs[funcionario.id] || ""} 
                      onValueChange={(epiId) => setSelectedEPIs({ ...selectedEPIs, [funcionario.id]: epiId })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecionar EPI para atribuir" />
                      </SelectTrigger>
                      <SelectContent>
                        {epis.map((epi) => (
                          <SelectItem key={epi.id} value={epi.id}>
                            {epi.nome} - CA: {epi.ca}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        const epiId = selectedEPIs[funcionario.id];
                        if (epiId) {
                          onAssignEPI(epiId, funcionario.id);
                          setSelectedEPIs({ ...selectedEPIs, [funcionario.id]: "" });
                        } else {
                          toast.error("Selecione um EPI antes de atribuir");
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Tabela de EPIs do funcionário */}
                {funcionarioEPIs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum EPI atribuído a este funcionário
                  </p>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>CA</TableHead>
                          <TableHead>Validade</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {funcionarioEPIs.map((epi) => {
                          const expirationStatus = getExpirationStatus(epi.validade);
                          
                          return (
                            <TableRow key={epi.id}>
                              <TableCell className="font-medium">{epi.nome}</TableCell>
                              <TableCell>{epi.ca}</TableCell>
                              <TableCell>{formatDate(epi.validade)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Badge variant={expirationStatus.variant}>
                                    {expirationStatus.label}
                                  </Badge>
                                  {expirationStatus.status === "expired" && (
                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                  )}
                                  {expirationStatus.status === "warning" && (
                                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                  )}
                                  {(expirationStatus.status === "warning" || expirationStatus.status === "expired") && (
                                    <span className="text-xs text-muted-foreground">
                                      {expirationStatus.days < 0 
                                        ? `${Math.abs(expirationStatus.days)} dias vencida` 
                                        : `${expirationStatus.days} dias`}
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{epi.tipo}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Dialog open={isViewDialogOpen && viewingEPI?.id === epi.id} onOpenChange={setIsViewDialogOpen}>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                          setViewingEPI(epi);
                                          setIsViewDialogOpen(true);
                                        }}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>Informações do EPI</DialogTitle>
                                      </DialogHeader>
                                      {viewingEPI && (
                                        <div className="space-y-4">
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <Label className="font-semibold">Nome</Label>
                                              <p className="text-sm mt-1">{viewingEPI.nome}</p>
                                            </div>
                                            <div>
                                              <Label className="font-semibold">CA</Label>
                                              <p className="text-sm mt-1">{viewingEPI.ca}</p>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <Label className="font-semibold">Tipo (Finalidade)</Label>
                                              <p className="text-sm mt-1">{viewingEPI.tipo}</p>
                                            </div>
                                            <div>
                                              <Label className="font-semibold">Fabricante</Label>
                                              <p className="text-sm mt-1">{viewingEPI.fabricante}</p>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <Label className="font-semibold">Data de Validade</Label>
                                              <p className="text-sm mt-1">{formatDate(viewingEPI.validade)}</p>
                                            </div>
                                            <div>
                                              <Label className="font-semibold">Data de Entrega</Label>
                                              <p className="text-sm mt-1">{formatDate(viewingEPI.entrega)}</p>
                                            </div>
                                          </div>
                                          <div>
                                            <Label className="font-semibold">Modo de Uso</Label>
                                            <p className="text-sm mt-1 whitespace-pre-wrap">{viewingEPI.uso}</p>
                                          </div>
                                        </div>
                                      )}
                                    </DialogContent>
                                  </Dialog>
                                  <Dialog open={isEditEPIDialogOpen && editingEPI?.id === epi.id} onOpenChange={setIsEditEPIDialogOpen}>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleEditEPIClick(epi)}
                                      >
                                        <Edit2 className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>Editar EPI</DialogTitle>
                                      </DialogHeader>
                                      <form onSubmit={handleEditEPISubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label htmlFor="edit-epi-nome">Nome do EPI</Label>
                                            <Input
                                              id="edit-epi-nome"
                                              value={editEPIForm.nome}
                                              onChange={(e) => setEditEPIForm({ ...editEPIForm, nome: e.target.value })}
                                              required
                                            />
                                          </div>
                                          <div>
                                            <Label htmlFor="edit-epi-ca">CA</Label>
                                            <Input
                                              id="edit-epi-ca"
                                              value={editEPIForm.ca}
                                              onChange={(e) => setEditEPIForm({ ...editEPIForm, ca: e.target.value })}
                                              required
                                            />
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label htmlFor="edit-epi-tipo">Tipo (Finalidade)</Label>
                                            <Input
                                              id="edit-epi-tipo"
                                              value={editEPIForm.tipo}
                                              onChange={(e) => setEditEPIForm({ ...editEPIForm, tipo: e.target.value })}
                                              required
                                            />
                                          </div>
                                          <div>
                                            <Label htmlFor="edit-epi-fabricante">Fabricante</Label>
                                            <Input
                                              id="edit-epi-fabricante"
                                              value={editEPIForm.fabricante}
                                              onChange={(e) => setEditEPIForm({ ...editEPIForm, fabricante: e.target.value })}
                                              required
                                            />
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label htmlFor="edit-epi-validade">Data de Validade</Label>
                                            <Input
                                              id="edit-epi-validade"
                                              type="date"
                                              value={editEPIForm.validade}
                                              onChange={(e) => setEditEPIForm({ ...editEPIForm, validade: e.target.value })}
                                              required
                                            />
                                          </div>
                                          <div>
                                            <Label htmlFor="edit-epi-entrega">Data de Entrega</Label>
                                            <Input
                                              id="edit-epi-entrega"
                                              type="date"
                                              value={editEPIForm.entrega}
                                              onChange={(e) => setEditEPIForm({ ...editEPIForm, entrega: e.target.value })}
                                              required
                                            />
                                          </div>
                                        </div>
                                        <div>
                                          <Label htmlFor="edit-epi-uso">Modo de Uso</Label>
                                          <Input
                                            id="edit-epi-uso"
                                            value={editEPIForm.uso}
                                            onChange={(e) => setEditEPIForm({ ...editEPIForm, uso: e.target.value })}
                                            required
                                          />
                                        </div>
                                        <Button type="submit" className="w-full">
                                          Salvar Alterações
                                        </Button>
                                      </form>
                                    </DialogContent>
                                  </Dialog>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onUnassignEPI(epi.atribuicaoId)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};
