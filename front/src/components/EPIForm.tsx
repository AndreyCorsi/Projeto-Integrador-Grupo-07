import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { EPI } from "@/types";
import { toast } from "sonner";
import { EPIAPI } from "@/lib/api";

interface EPIFormProps {
  onAdd: (epi: EPI) => void;
}

export const EPIForm = ({ onAdd }: EPIFormProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    validade: "",
    ca: "",
    tipo: "",
    uso: "",
    fabricante: "",
    entrega: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Converter datas para o formato ISO Date
      const validadeDate = new Date(formData.validade).toISOString();
      const entregaDate = new Date(formData.entrega).toISOString();

      const response = await EPIAPI.criar({
        epi: formData.nome,
        CA: formData.ca,
        modo_uso: formData.uso,
        validade: validadeDate,
        tipo: formData.tipo,
        fabricante: formData.fabricante,
        data_entrada: entregaDate,
      });

      // Criar objeto EPI para o frontend
      const newEPI: EPI = {
        id: formData.ca, // Usar CA como ID único
        nome: formData.nome,
        validade: formData.validade,
        ca: formData.ca,
        tipo: formData.tipo,
        uso: formData.uso,
        fabricante: formData.fabricante,
        entrega: formData.entrega,
      };

      onAdd(newEPI);
      setFormData({
        nome: "",
        validade: "",
        ca: "",
        tipo: "",
        uso: "",
        fabricante: "",
        entrega: "",
      });
      toast.success("EPI cadastrado com sucesso!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao cadastrar EPI");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="animate-in fade-in duration-500">
      <CardHeader className="bg-gradient-primary">
        <CardTitle className="text-primary-foreground">Cadastro de EPI</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validade">Validade</Label>
              <Input
                id="validade"
                type="date"
                value={formData.validade}
                onChange={(e) => setFormData({ ...formData, validade: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ca">CA</Label>
              <Input
                id="ca"
                value={formData.ca}
                onChange={(e) => setFormData({ ...formData, ca: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo (Finalidade)</Label>
              <Input
                id="tipo"
                placeholder="Ex: Risco em Altura"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="uso">Modo de Uso</Label>
            <Textarea
              id="uso"
              value={formData.uso}
              onChange={(e) => setFormData({ ...formData, uso: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fabricante">Fabricante</Label>
              <Input
                id="fabricante"
                value={formData.fabricante}
                onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entrega">Data de Entrega</Label>
              <Input
                id="entrega"
                type="date"
                value={formData.entrega}
                onChange={(e) => setFormData({ ...formData, entrega: e.target.value })}
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
                <Save className="h-4 w-4 mr-2" />
                Cadastrar EPI
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
