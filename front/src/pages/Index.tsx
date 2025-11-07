import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EPIForm } from "@/components/EPIForm";
import { FuncionarioForm } from "@/components/FuncionarioForm";
import { FuncionarioEPIManager } from "@/components/FuncionarioEPIManager";
import { EPIsVencidas } from "@/components/EPIsVencidas";
import { UpdateCAModal } from "@/components/UpdateCAModal";
import { HardHat, User, Users, AlertTriangle, Loader2 } from "lucide-react";
import { EPI, Funcionario, EPIAtribuicao } from "@/types";
import { toast } from "sonner";
import { FuncionarioAPI, EPIAPI } from "@/lib/api";

const Index = () => {
  const [epis, setEpis] = useState<EPI[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [atribuicoes, setAtribuicoes] = useState<EPIAtribuicao[]>([]);
  const [selectedEPI, setSelectedEPI] = useState<EPI | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados da API ao montar o componente
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Carregar funcionários
        const funcionariosData = await FuncionarioAPI.listar();
        const funcionariosFormatados = funcionariosData.map((func: any) => ({
          id: func.cpf,
          nome: func.nome,
          cpf: formatCPF(func.cpf),
          cargo: func.cargo,
          setor: func.setor,
        }));
        setFuncionarios(funcionariosFormatados);

        // Carregar EPIs
        const episData = await EPIAPI.listar();
        const episFormatados = episData.map((epi: any) => ({
          id: epi.CA,
          nome: epi.epi,
          validade: new Date(epi.validade).toISOString().split("T")[0],
          ca: epi.CA,
          tipo: epi.tipo,
          uso: epi.modo_uso,
          fabricante: epi.fabricante,
          entrega: new Date(epi.data_entrada).toISOString().split("T")[0],
        }));
        setEpis(episFormatados);

        // Carregar atribuições do localStorage (ainda não há endpoint na API)
        const savedAtribuicoes = localStorage.getItem("atribuicoes");
        if (savedAtribuicoes) {
          setAtribuicoes(JSON.parse(savedAtribuicoes));
        }
      } catch (error) {
        toast.error("Erro ao carregar dados da API");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Salvar atribuições no localStorage (até haver endpoint na API)
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("atribuicoes", JSON.stringify(atribuicoes));
    }
  }, [atribuicoes, isLoading]);

  const formatCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const handleAddEPI = async (epi: EPI) => {
    setEpis([...epis, epi]);
    // Recarregar EPIs da API para garantir sincronização
    try {
      const episData = await EPIAPI.listar();
      const episFormatados = episData.map((epi: any) => ({
        id: epi.CA,
        nome: epi.epi,
        validade: new Date(epi.validade).toISOString().split("T")[0],
        ca: epi.CA,
        tipo: epi.tipo,
        uso: epi.modo_uso,
        fabricante: epi.fabricante,
        entrega: new Date(epi.data_entrada).toISOString().split("T")[0],
      }));
      setEpis(episFormatados);
    } catch (error) {
      console.error("Erro ao recarregar EPIs:", error);
    }
  };

  const handleDeleteEPI = async (id: string) => {
    try {
      await EPIAPI.remover(id);
      setEpis(epis.filter((epi) => epi.id !== id));
      toast.success("EPI excluído com sucesso!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao excluir EPI");
    }
  };

  const handleUpdateCA = async (id: string, ca: string, validade: string) => {
    setEpis(
      epis.map((epi) =>
        epi.id === id ? { ...epi, ca, validade } : epi
      )
    );

    // Recarregar EPIs da API para garantir sincronização
    try {
      const episData = await EPIAPI.listar();
      const episFormatados = episData.map((epi: any) => ({
        id: epi.CA,
        nome: epi.epi,
        validade: new Date(epi.validade).toISOString().split("T")[0],
        ca: epi.CA,
        tipo: epi.tipo,
        uso: epi.modo_uso,
        fabricante: epi.fabricante,
        entrega: new Date(epi.data_entrada).toISOString().split("T")[0],
      }));
      setEpis(episFormatados);
    } catch (error) {
      console.error("Erro ao recarregar EPIs:", error);
    }
  };

  const handleAddFuncionario = async (funcionario: Funcionario) => {
    setFuncionarios([...funcionarios, funcionario]);
    // Recarregar funcionários da API para garantir sincronização
    try {
      const funcionariosData = await FuncionarioAPI.listar();
      const funcionariosFormatados = funcionariosData.map((func: any) => ({
        id: func.cpf,
        nome: func.nome,
        cpf: formatCPF(func.cpf),
        cargo: func.cargo,
        setor: func.setor,
      }));
      setFuncionarios(funcionariosFormatados);
    } catch (error) {
      console.error("Erro ao recarregar funcionários:", error);
    }
  };

  const handleDeleteFuncionario = (id: string) => {
    setFuncionarios(funcionarios.filter((func) => func.id !== id));
  };

  const handleAssignEPI = async (epiId: string, funcionarioId: string) => {
    const epi = epis.find(e => e.id === epiId);

    if (!epi) {
      toast.error("EPI não encontrado");
      return;
    }

    try {
      // Registrar a substituição/atribuição na API
      await EPIAPI.registrarSubstituicao({
        identificadorFuncionario: funcionarioId,
        motivo: "Atribuição de EPI",
        novoEpi: {
          epi: epi.nome,
          CA: epi.ca,
          modo_uso: epi.uso,
          validade: new Date(epi.validade).toISOString(),
          tipo: epi.tipo,
          fabricante: epi.fabricante,
          data_entrada: new Date(epi.entrega).toISOString(),
        },
      });

      // Adicionar atribuição local
      const novaAtribuicao: EPIAtribuicao = {
        id: `${epiId}-${funcionarioId}-${Date.now()}`,
        epiId,
        funcionarioId,
        dataEntrega: new Date().toISOString().split('T')[0],
        validade: epi?.validade || new Date().toISOString().split('T')[0]
      };
      setAtribuicoes([...atribuicoes, novaAtribuicao]);
      toast.success("EPI atribuído ao funcionário!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atribuir EPI");
    }
  };

  const handleUnassignEPI = (atribuicaoId: string) => {
    setAtribuicoes(atribuicoes.filter(at => at.id !== atribuicaoId));
    toast.success("EPI desvinculado do funcionário!");
  };

  const handleUpdateFuncionario = (updatedFuncionario: Funcionario) => {
    setFuncionarios(
      funcionarios.map(f => f.id === updatedFuncionario.id ? updatedFuncionario : f)
    );
  };

  const handleUpdateAtribuicaoValidade = (atribuicaoId: string, validade: string) => {
    setAtribuicoes(
      atribuicoes.map(at => at.id === atribuicaoId ? { ...at, validade } : at)
    );
  };

  const openUpdateModal = (epi: EPI) => {
    setSelectedEPI(epi);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <Tabs defaultValue="gerenciar" className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
            <TabsTrigger value="epi" className="flex items-center gap-2">
              <HardHat className="h-4 w-4" />
              <span className="hidden sm:inline">Cadastro de EPI</span>
              <span className="sm:hidden">EPI</span>
            </TabsTrigger>
            <TabsTrigger value="funcionario" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Cadastro de Funcionário</span>
              <span className="sm:hidden">Funcionário</span>
            </TabsTrigger>
            <TabsTrigger value="gerenciar" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Funcionários e EPIs</span>
              <span className="sm:hidden">Gerenciar</span>
            </TabsTrigger>
            <TabsTrigger value="vencidas" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">EPIs Vencidas</span>
              <span className="sm:hidden">Vencidas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="epi">
            <EPIForm onAdd={handleAddEPI} />
          </TabsContent>

          <TabsContent value="funcionario">
            <FuncionarioForm onAdd={handleAddFuncionario} />
          </TabsContent>

          <TabsContent value="gerenciar">
            <FuncionarioEPIManager
              funcionarios={funcionarios}
              epis={epis}
              atribuicoes={atribuicoes}
              onAssignEPI={handleAssignEPI}
              onUnassignEPI={handleUnassignEPI}
              onUpdateCA={openUpdateModal}
              onDeleteEPI={handleDeleteEPI}
              onUpdateFuncionario={handleUpdateFuncionario}
              onUpdateAtribuicaoValidade={handleUpdateAtribuicaoValidade}
              onDeleteFuncionario={handleDeleteFuncionario}
            />
          </TabsContent>

          <TabsContent value="vencidas">
            <EPIsVencidas
              epis={epis}
              funcionarios={funcionarios}
              atribuicoes={atribuicoes}
              onUpdateCA={openUpdateModal}
            />
          </TabsContent>
        </Tabs>
      </main>

      <UpdateCAModal
        epi={selectedEPI}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdate={handleUpdateCA}
      />
    </div>
  );
};

export default Index;
