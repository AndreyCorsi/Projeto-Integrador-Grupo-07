import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";
import { Funcionario } from "@/types";
import { toast } from "sonner";
import { FuncionarioAPI } from "@/lib/api";

interface FuncionarioFormProps {
  onAdd: (funcionario: Funcionario) => void;
}

export const FuncionarioForm = ({ onAdd }: FuncionarioFormProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    cargo: "",
    setor: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Remover formatação do CPF para enviar apenas números
      const cpfNumeros = formData.cpf.replace(/\D/g, "");

      const response = await FuncionarioAPI.criar({
        nome: formData.nome,
        cpf: cpfNumeros,
        cargo: formData.cargo,
        setor: formData.setor,
      });

      // Criar objeto funcionário com ID único para o frontend
      const newFuncionario: Funcionario = {
        id: cpfNumeros, // Usar CPF como ID único
        nome: formData.nome,
        cpf: formData.cpf,
        cargo: formData.cargo,
        setor: formData.setor,
      };

      onAdd(newFuncionario);
      setFormData({
        nome: "",
        cpf: "",
        cargo: "",
        setor: "",
      });
      toast.success("Funcionário cadastrado com sucesso!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao cadastrar funcionário");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    }
    return value;
  };

  return (
    <Card className="animate-in fade-in duration-500">
      <CardHeader className="bg-gradient-primary">
        <CardTitle className="text-primary-foreground">Cadastro de Funcionário</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="func-nome">Nome</Label>
              <Input
                id="func-nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="func-cpf">CPF</Label>
              <Input
                id="func-cpf"
                value={formData.cpf}
                onChange={(e) =>
                  setFormData({ ...formData, cpf: formatCPF(e.target.value) })
                }
                placeholder="000.000.000-00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="func-cargo">Cargo</Label>
              <Input
                id="func-cargo"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="func-setor">Setor</Label>
              <Input
                id="func-setor"
                value={formData.setor}
                onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                required
              />
            </div>
          </div>

          <Button type="submit" className="bg-gradient-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cadastrando...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Cadastrar Funcionário
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
